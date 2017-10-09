# Arachne
Network infrastructure for collaborative studies across disparate data nodes and researches

# Init

After initiating project copy community code into `community-src` folder: 
```
git clone https://bitbucket.org/Odysseus/arachnefront.git community-src
```

# Development guide

## Module structure

- /components
  - /Dummy
    - container.js(x)
    - index.js
    - presenter.jsx
    - selectors.js
    - style.scss
- /converters
- /ducks
- const
- index
- routes

## Contracts

### Container

Implements `ConnectedComponentBuilder.ts`:
```
interface ConnectedComponentBuilder {
  mapStateToProps: Function;
  mapDispatchToProps: Function;
  mergeProps: Function;
  getFetchers: Function;
  build: Function;
}
```

### Selectors
Implements `ISelectorsBuilder`:
```
interface ISelectorsBuilder {
  build: () => Map<string, Selector<Object, any>>;
}
```

Separate functions for retrieving data from state, converting data (accept dependencies as function parameters), and for creation of selectors. E.g.:
```
class DataCatalogListTableSelectorsBuilder {

  getSearchStr(state) {
    return get(state, 'routing.locationBeforeTransitions.search', '');
  }

  getSearchQuery(searchStr) {
    ...
    return someData;
  }

  buildSelectorForGetSearchQuery() {
    return createSelector([this.getSearchStr], this.getSearchQuery);
  }

  build() {
    return {
      getSearchQuery: this.buildSelectorForGetSearchQuery(),
    };
  }
}
```