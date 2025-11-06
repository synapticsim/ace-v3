# ACE v3
The third iteration of the Advanced Cockpit Emulator.

## Installation and usage
1. [Install Rust and toolchain](https://tauri.app/v1/guides/getting-started/prerequisites)
2. Clone the repo and `cd` into it
3. `npm i`
4. `npm start`

## Recommended IDE Setup for development

- [VS Code](https://code.visualstudio.com) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)


## Creating New Project

1. Project Name : The project name is simply the name you want to give to the project, for exemple `A380X`.
2. Project Root : It is the root of youre project it will also contain the `.ace` directory wich contains the project simvars, ... (exemple for the A380X: `/fbw-a380x/`)
3. Instruments : The instruments directory contains multiple subdirectories for each instruments. (exemple for the A380X: `/fbw-a380x/src/systems/instruments/src/`)
4. Bundles : Bundles directory is generated as a side-effect of your build system. If you use rollup or webpack, you'll have to configure it by yourself, a simpler option is mach where it is done automaticlly. (exemple for the A380X (the FBW builder generates a bundles directory by default): `/fbw-a380x/bundles`)
5. HTML_UI : Wherever you throw in the files for the MSFS virtual file system. This is the directory used for resource GET requests such as fonts loaded with the url function. (exemple for the A380X: `/fbw-A380X/out/`)

## Configuring the Instruments

The config.json of your instruments should look like this 
```bash 
{
  "index": "./instrument.tsx",
  "name": "MFD",
  "dimensions": {
    "width": 1536,
    "height": 1024
  },
  "isInteractive": true
}
``` 
(exemple from the A380X MFD config.json)
