export const generateProductErrorInfo = (product) => {
    return `Una o mas propiedas estan incompletas o son inválidas.
    Lista de las propiedades requeridas:
    *Title: necesita que sea tipo string, recibimos ${product.title}
    *Description: necesita que sea tipo string, recibimos ${product.description}
    *Code: necesita que sea tipo string, recibimos ${product.code}
    *Price: necesita que sea tipo string, recibimos ${product.price}
    *Stock: necesita que sea tipo number, recibimos ${product.stock}
    *Category: necesita que sea tipo string, recibimos ${product.category}`
}