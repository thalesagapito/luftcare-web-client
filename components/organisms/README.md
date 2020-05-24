# Organisms

Organisms may **have a defined place in a page by themselves**, this means that they do not need to be reusable, but _can_ be.  
A `navbar` would is an example of an organism because it can determine **where it should be** and **what is its purpose** by itself.  
Organisms can contain atoms, molecules and other organisms.  
`Sometimes`, organisms can simply be parts of a whole bigger organism. When this happens a file tree like the following should be present:  

```yaml
> TheSidebar
  > TheSidebar.vue
  > TheSidebarLeftButton.vue
  > TheSidebarRightButton.vue
  > TheSidebarTitle.vue
```
