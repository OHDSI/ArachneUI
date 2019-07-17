# Arachne
Network infrastructure for collaborative studies across disparate data nodes and researches

ArachneUI is the web application which can be assembled in the Arachne Central or Datanode mode.

# Build Web Applications

###Get sources
Checkout [ArachneUI repository](https://github.com/OHDSI/ArachneUI.git): 
```
git clone https://github.com/OHDSI/ArachneUI.git 
```

###Install npm packages

After getting the sources please execute following commands: 

```
cd ArachneUI
npm install
```

###Build

In order to assemble Arachne Central web application please run:
```
npm run build
```
In order to assemble ArachneNode web application please run:
```
npm run build-node
```

# Development guide

### Run in development mode

In order to start portal web app please start [ArachneCentralAPI](https://github.com/OHDSI/ArachneCentralAPI) backend and execute following command:
```
npm run portal
```

In order to start datanode web app please start [ArachneNodeAPI](https://github.com/OHDSI/ArachneNodeAPI) backend run following command:
```
npm run node
```

Webpack dev serser should start at [localhost:3010](http://localhost:3010)

### Module structure

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

