<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: CC0-1.0
-->

# Guidelines

The following document presents the guidelines to follow when developing for this project. It contains a series of directives useful for creating uniform code in order to make it easily readable and maintainable.

If something is not specified below, it is advisable to try to search for a similar implementation in the code and, if it cannot be found, to ask on Github confirmation of the chosen implementation approach before starting.

## Table of Contents

- [Coding Style](#coding-style)
- [Platform assumptions](#platform-assumptions)

### Coding Style

1. Components should be written using the Composition API, always indicating the default properties.

```typescript
withDefaults(
  defineProps<{
    value?: string;
  }>(),
  {
    value: "",
  }
);
```

2. Use two spaces for indentation.
3. The Tailwind classes shall be included in the Elements template and non separated in the style section of the component.
4. Date manipulation should be performed using the date-fns library [https://date-fns.org/](https://date-fns.org/).
5. SVGs should be inserted without fixed dimensions, without safety spaces, and without specifying the fill/stroke color. Instead, the currentColor property should be used.
6. Plugins/libraries that are not useful throughout the project should only be included asynchronously in the individual component and not in main.ts, using the following method:

```typescript
const MyLibrary = defineAsyncComponent(() => import("my-library"));
```

7. All types must be clearly defined. Using "any" as a type is not recommended. If you think you really need the "any" type, please ask on GitHub before.
8. Before developing any new component, it should be verified that it is not already present in /src/components/.
9. All texts must be inserted as translatable strings, with the corresponding English translation in /src/locales/en.json.
10. Before any PR, all commented-out code should be removed, or if it is necessary to release it because it is highly likeable that it will be reused in the near future, leaving a NOTE that specifies the reason.
11. Please make sure that the code compiles (running "npm run build") and passes the linting tasks. In addition, please make sure that your branch is up-to-date with the current development branch.

### Platform assumptions

1. The DetailView and EditView are designed to be generated through configuration files, differentiated according to the type of dataset. These files are located in the path /src/config/DATASET_NAME/DATASET_NAME.VIEW_TYPE.ts. For example, in /src/config/odhActivityPoi/odhActivityPoi.editView.ts, you can see the configuration of the EditView for points of interest.
2. If the views define their respective components from the configuration file, they must use the ComponentRender component. To include the components with the ComponentRender component, they must be defined in /src/components/registerForComponentRender.js, and then the related components must be placed in the /src/components/ folder, using the following extension: "forRender". Eg, a component called Table that can ben rendered using the ComponentRender component, must be called Table.forRender.vue. Plus, all components built to be rendered with the ComponentRender, must respect the following predefined structure details:

```
1. If a components emits a data update, it must always call the emit event called "update" passing the data of the update as an object of type ForRenderComponentEmit >>> { prop: string, value: any } >>> is this correct?
2. TODO?
```

3. The list of components included in registerForComponentRender.ts must be entered in alphabetical order.
4. As a general rule, avoid retrieving data within your component. If it's necessary to do so, please ask for before on GitHub.
