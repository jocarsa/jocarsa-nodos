# jocarsa | nodos - v23 compilador C/C++ corregido

Corrección:

El error:

```text
Cannot read properties of undefined (reading 'functionStart')
```

ocurría porque los botones C/C++ llamaban a `showCode("c")` o `showCode("cpp")`,
pero en `compilers` no existían correctamente las claves `c` y `cpp`.

En v23:

1. `compilers.c` existe.
2. `compilers.cpp` existe.
3. Se añade protección si un compilador no existe.
4. Se mantienen los botones C/C++ visibles.
5. Se conserva backend PHP + SQLite.
