# jocarsa | nodos - prototipo v7

Mejora principal:

La generación de Python y JavaScript ahora se deriva del grafo visual:

- Lee conexiones reales entre nodos.
- Usa la salida de cada nodo como expresión para el siguiente.
- `Operación` compila usando sus entradas A/B si están conectadas.
- `Comparación` compila usando sus entradas A/B y genera una variable booleana.
- Las salidas TRUE/FALSE se representan como expresión booleana o negada.
- `Mostrar` compila usando su entrada conectada.

Ejemplo:

```text
48 + 5 > 50 -> TRUE -> Mostrar
```

Python generado aproximado:

```python
edad = 48
suma = 5
resultado = edad + suma
cond_n4 = resultado > 50
print(cond_n4)
```

JavaScript generado aproximado:

```js
let edad = 48;
let suma = 5;
resultado = edad + suma;
cond_n4 = resultado > 50;
console.log(cond_n4);
```
