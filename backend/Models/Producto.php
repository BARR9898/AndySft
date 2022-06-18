<?php
namespace Models;

class Producto {

	private $DB;

	function __construct($DB)
	{
		$this->DB = $DB;
	}

	//Metodo que obtiene todos los productos de la BDD
	//y los retorna.
	function getProductos()
	{
		//Query para traer los productos de la BDD
		$Q = "SELECT *
				FROM productos p";
		$Q = $this->DB->prepare($Q); //prepara la peticion
		$Q->execute(); //ejecuta la peticion
		return $Q;
	}


	//Metodo para crear productos, retorna el resultado de la query
	function addProducto($p)
	{

		//query para crear un producto
		$Q = "INSERT INTO productos SET
				nombre = :nombre,
				codigo = :codigo,
				precio = :precio,
				descripcion = :descripcion,
				cantidad = :cantidad";
		$Q = $this->DB->prepare($Q);
		//Asigna las propiedades del objeto $p a los campos
		//correspondientes a la query
		$Q->bindParam(':nombre', $p->nombre);
		$Q->bindParam(':codigo', $p->codigo);
		$Q->bindParam(':precio', $p->precio);
		$Q->bindParam(':descripcion', $p->descripcion);
		$Q->bindParam(':cantidad', $p->cantidad);
		$Q->execute();
		return $Q;
	}

	function updateProducto($p)
	{
		$Q = "UPDATE productos SET
				nombre = :nombre,
				codigo = :codigo,
				precio = :precio,
				descripcion = :descripcion,
				cantidad = :cantidad
				WHERE id = :id";
		$Q = $this->DB->prepare($Q);
		$Q->bindParam(':nombre', $p->nombre);
		$Q->bindParam(':codigo', $p->codigo);
		$Q->bindParam(':precio', $p->precio);
		$Q->bindParam(':descripcion', $p->descripcion);
		$Q->bindParam(':cantidad', $p->cantidad);
		$Q->bindParam(':cantidad', $p->cantidad);
		$Q->bindParam(':id', $p->id);
		$Q->execute();
		return $Q;
	}

	function deleteProducto($p)
	{
		$Q = "DELETE  FROM productos WHERE id = :id";
		$Q = $this->DB->prepare($Q);
		$Q->bindParam(':nombre', $p->nombre);
		$Q->bindParam(':codigo', $p->codigo);
		$Q->bindParam(':precio', $p->precio);
		$Q->bindParam(':descripcion', $p->descripcion);
		$Q->bindParam(':cantidad', $p->cantidad);
		$Q->bindParam(':cantidad', $p->cantidad);
		$Q->bindParam(':id', $p->id);
		$Q->execute();
		return $Q;
	}


}