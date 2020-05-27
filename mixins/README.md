# Mixins

Mixins are used to share functionality between Vue components.  
An example is the logout function, which should be accessible from many places in the app.  
A mixin method should always be camelCase and include the mixin name in it. Example:

### AuthMethods

Has the following methods:

- logout
  So the exported function name should be `authMethodsLogout`.
  It is also the mixin's responsibility to augment the Vue component options with its methods.
  It is also necessary that the mixin be included in the RegisteredMixins file, and only that file be imported in components. This ensures we are using named exports and helps users identify mixin namespace names.
