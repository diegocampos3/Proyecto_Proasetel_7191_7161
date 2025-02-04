"use client";
import "./chunk-ZRMFTPPU.js";
import "./chunk-LDGES3TI.js";
import {
  createBox
} from "./chunk-6IDOQSOW.js";
import "./chunk-CUFEGLSE.js";
import "./chunk-IQDMUVFO.js";
import "./chunk-U2P2NB3V.js";
import {
  ClassNameGenerator_default,
  createTheme_default,
  generateUtilityClasses,
  identifier_default
} from "./chunk-YR6HQZG7.js";
import "./chunk-XMDSUGX4.js";
import {
  __toESM,
  require_prop_types
} from "./chunk-YY4B3FRN.js";

// node_modules/@mui/material/Box/Box.js
var import_prop_types = __toESM(require_prop_types());

// node_modules/@mui/material/Box/boxClasses.js
var boxClasses = generateUtilityClasses("MuiBox", ["root"]);
var boxClasses_default = boxClasses;

// node_modules/@mui/material/Box/Box.js
var defaultTheme = createTheme_default();
var Box = createBox({
  themeId: identifier_default,
  defaultTheme,
  defaultClassName: boxClasses_default.root,
  generateClassName: ClassNameGenerator_default.generate
});
true ? Box.propTypes = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │    To update them, edit the d.ts file and run `pnpm proptypes`.     │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * @ignore
   */
  children: import_prop_types.default.node,
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: import_prop_types.default.elementType,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: import_prop_types.default.oneOfType([import_prop_types.default.arrayOf(import_prop_types.default.oneOfType([import_prop_types.default.func, import_prop_types.default.object, import_prop_types.default.bool])), import_prop_types.default.func, import_prop_types.default.object])
} : void 0;
var Box_default = Box;
export {
  boxClasses_default as boxClasses,
  Box_default as default
};
//# sourceMappingURL=@mui_material_Box.js.map
