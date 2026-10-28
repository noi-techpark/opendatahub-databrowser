<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: CC0-1.0
-->

# Dataset configuration

The dataset views of the Data Browser App are configured in files located at the [dataset configs](../../databrowser/src/config) folder.

You can find the different datasets in their respective category for now we have only `tourism` but we plan to add `mobility` and others.

Each dataset has a list and shared view. The shared view is for visualizing the detail and edit view, they are united because they share the same base.

For example, if you want to modify the detail view configuration of the `Article` dataset, adjust the config in [article.sharedView.ts](../../databrowser/src/config/tourism/article/article.sharedlView.ts) file.

## Config description

> Attention: the shape of the configuration is still work on progress and may change in the future.

Each view for each dataset is defined by the appropriate configuration.

Where no configuration for a dataset is provided, the Data Browser tries to generate a configuration on a best-effort basis with the information provided by the OpenAPI definitions provided by the Open Data Hub. This is referred to as `autoconfiguration` or `no-config`. Usually you do not have to bother with that system.

Each dataset configuration is of type `DatasetConfig` (see [types.ts](../../databrowser/src/domain/datasetConfig/types.ts)). It consists of properties common to all views of a given dataset:

- source (type: SourceType): describes the source of the configuration, possible values are 'embedded' and 'generated'
- baseUrl (type: string): defines the base URL of the endpoint where the dataset is loaded from
- route (type: DatasetRoute): gives additional routing information for the dataset, like domain (e.g. `tourism`) and path parameter (e.g. `['v1', 'Article']` for the EventShort dataset). Note that the optional `id` property is only used internally - do not set this in the configuration
- description (type: DatasetDescription): provides a description for the dataset with `title`, `subtitle` and `description` properties. The description is shown in different places of the Data Browser, e.g. in the upper left of the different views
- views (type: Record<string, \*ViewConfig>): the `views` attribute contains the different view configurations of a dataset (`table`, `detail`, `raw` and `edit`)
- operations (type: Record<string, Operation>): contains information for the different endpoint operations (`readAll`, `read`, `create`, `update` and `delete`). At the moment it contains only information about the roles necessary to invoke an operation (authorization). For example, to update a dataset a user must have a certain role like `DatasetWriter`.

## View configurations

The view configurations for `table`, `detail` and `edit` share a common type with an array - property called `elements`. Inside that property one can provide information on how to render parts of a dataset.

## Builder for configs

To avoid redundancy and generalize the configurations components we created these builders that can be used in the appropriate single configurations files.
You can find them in the [builder](../../databrowser/src/config/builder/tourism/) folder.
Inside the components follow this naming conventions:

- Cell: returns a single component
- Cells: returns two or more components
- category: returns a complete menu section (e.g. ContactCategory in [contact.ts](../../databrowser/src/config/builder/tourism/contact.ts) )
- subcategory: returns a section inside the menu/main section (e.g. dataStatesSubCategory in [dataStates.ts](../../databrowser/src/config/builder/tourism/dataStates.ts) )
- TableCell: is used for the list view

### Table view

The table view gives a list-like overview over the records of a dataset. The user can paginate through the data and jump to detail, edit and raw view for a given record using the links on the right of the table view.

Let's take a look at table view configuration of the `Article` dataset as an example, that can be found here: [article.listView.ts](../../databrowser/src/config/tourism/article/article.listView.ts) (the result can be found at this URL [https://databrowser.opendatahub.com/dataset/table/tourism/v1/Article](https://databrowser.opendatahub.com/dataset/table/tourism/v1/Article)):

```javascript
{
  title: 'SubType',
  component: CellComponent.StringCell,
  class: 'w-48',
  objectMapping: {
    text: 'SubType',
  },
},
{
  title: 'Tags',
  component: CellComponent.ArrayCell,
  class: 'w-40',
  objectMapping: {
    items: 'SmgTags',
  },
  params: {
    separator: ', ',
  },
},
languageTableCell(),
lastChangesTableCell(),
...
```

One can see how four columns of the table view are defined:
The last two with the appropriate generalized builder and the first two without.

- title (type: string): this is the title of column, shown in the table header
- component (type: string): this is the name of the component that should render parts of a dataset. Components must be registered before they can be used in a configuration, see [Vue Components](./vue-components.md) and [Web Components](./web-components.md) on how to create and register new components
- class (type: string): additional CSS classes that should be applied to the table column. This is useful e.g. to define the width of a column
- objectMapping (type: Record<TargetPropertyName, PropertyPath>): this property defines how data from the API is mapped to Data Browser components. The `PropertyPath` defines the path to a property inside the API data. The `TargetPropertyName` defines the attribute name under which that property content is provided to the Data Browser component. For the first entry we see that the value of property `SubType` of the `Article` dataset should be handed over to the `CellComponent.StringCell` component as attribute named `text`.
  For the second entry we see that the items of the array `SmgTags` should be passed to the component as attribute `items`. If you take a look at the [ArrayCell component](../../databrowser/src/domain/cellComponents/components/cells/arrayCell/ArrayCell.vue) you will see that that component expects the attributes (properties in Vue) `items`. Using this mechanism it is possible to decouple dataset property names from component attributes.
- There is another optional property that can be used in the table view definition, called `params` (type: Record<string, string>). That property can be used to provide static data to a component, e.g. the `separator` for the [ArrayCell component](../../databrowser/src/domain/cellComponents/components/cells/arrayCell/ArrayCell.vue) that is used to join data.

> Another optional property called `filters` is also available but that will change. Please don't use it as of now.

### Detail and Edit view (sharedView)

The detail view shows categorized details for a given record of a dataset. The user can move through the categories using the navigable links on the left of the detail view.

The edit view can be used to modify a given record of a dataset.

Let's take a look at shared view configuration of the `Article` dataset as an example, that can be found here: [article.sharedView.ts](../../databrowser/src/config/tourism/article/article.sharedView.ts) (the result of the detail view can be found at this URL [https://databrowser.opendatahub.com/dataset/detail/tourism/v1/Article/D77A65F8-E1A2-7105-43F3-ECEA6F206B9A](https://databrowser.opendatahub.com/dataset/detail/tourism/v1/Article/D77A65F8-E1A2-7105-43F3-ECEA6F206B9A). Note that you can visualize the edit view only if you are an authorized user):

```javascript
export const articleSharedView = (): DetailViewConfig | EditViewConfig => ({
  elements: [
    {
      name: 'Main data',
      slug: 'main-data',
      subcategories: [
        {
          name: 'General data',
          properties: [shortnameCell()],
        },
        {
          name: 'IDs',
          properties: [idReadOnlyCell()],
        },
        dataStatesSubCategory(),
        sourceSubCategory(),
      ],
    },
    textInfoCategory(),
    contactCategory(),
    imageGalleryCategory(),
  ...
]
```

One can see that the configuration is similar to the table view configuration and that is true for the entries inside the `properties` property. Please take a look at the [Table view](#table-view) section for an overview.

But there is more to the detail view config. Each `properties` property is part of structure that defines a category `name` (type: string), its `slug` (type: string) used as hash-part of the URL and the subcategory it belongs to.

The reason for the enhanced structure is, that the detail view has a concept of categories, subcategories and items that are shown under a subcategory.

The categories of a dataset are shown as navigable links at the left of the detail view. A click on a link changes the URL hash (slug), leading the detail view to show the contents of that category.

The subcategories are shown in bold on the main content part of the detail view. Each subcategory has one or many items that are shown below it.

### Raw view

The raw view shows the JSON data for a given record of a dataset. No further configuration is necessary for the raw view to work.
