# Styles directory
The style language used in the project is [Sass](https://sass-lang.com/). The styles are written in the [SCSS](https://sass-lang.com/documentation/syntax) syntax.

## Directory structure
```
src
└── styles
    ├── base
    │   ├── reset.scss
    │   └── typography.scss    
    ├── components
    ├── layout
    ├── themes
    ├── utilities
    │   ├── mixins.scss
    │   └── variables.scss
    ├── views
    └── global.scss
```
The directory structure was inspired by [this article](https://www.sitepoint.com/architecture-sass-project/) and a [course](https://www.educative.io/courses/sass-for-css) on educative.io accessible through the github student pack.  
Both resources recommended the use of a 7 folder structure for Sass projects.  
The 7 folders are:
- base
- components
- layout
- pages
- themes
- utilities
- vendors

To adapt the structure to the project, the `pages` folder was renamed to `views` and the `vendors` folder was removed.  

