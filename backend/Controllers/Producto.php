<?php
namespace Controllers;

use PDO;
use Controllers\BaseController;
use Config\Conexion;
use Models\Producto as ModelsProducto;

class Producto extends BaseController {

   private $DB;
   private $Producto;

	function __construct()
   {
		$this->DB = new Conexion();
      $this->DB = $this->DB->Conectar();
      $this->Producto = new ModelsProducto($this->DB);
	}

   function getProductos()
   {
      try {
         //Obtiene los productos de la base de datos
         $res = $this->Producto->getProductos();
         //Convierte la variable $res con los productos en un arreglo de objetos
         $productos = $res->fetchAll(PDO::FETCH_OBJ);


         foreach ($productos as &$p) {
            
            $p->nombre = (string) $p->nombre;
            $p->codigo = (string) $p->codigo;
            $p->precio = (float) $p->precio;
            $p->descripcion = (string) $p->descripcion;
            $p->cantidad = (int) $p->cantidad;
         }

         //asigna la los prouductos al objeto $respuesta
         $respuesta = [
            'result' => true,
            'data' => $productos
         ];


         //Responde el metodo con la respuesta que son los
         //productos (return del método)
         $this->responder($respuesta);
         
         //cacha el error en caso de que no exista algun resultado
         //e imprime el tipo de erros
      } catch (\PDOException $err) {
         $this->responder([
            'result' => false,
            'message' => $err
         ]);
      }
   }


   function saveProducto()
   {
      $this->validar($this->request(), [
         'nuevo' => 'present|boolean',
         'id' => 'present',
         'nombre' => 'required',
         'codigo' => 'required',
         'precio' => 'required',
         'descripcion' => 'required',
         'cantidad' => 'required'
      ]);

      $req = $this->request();
      $this->DB->beginTransaction();

      try {

         if ($req->nuevo) {
            $this->Producto->addProducto($req);
         }else{
            $this->Producto->updateProducto($req);
         }
         
         $accion = $req->nuevo ? 'registrado':'editado';
         $this->DB->commit();

         $this->responder([
            'result' => true,
            'message' => "Producto $accion con exito"
         ]);
         
      } catch (\PDOException $err) {
         $this->DB->rollBack();
         $this->responder([
            'result' => false,
            'message' => 'Ocurrió un error al intentar guardar los datos',
            'errorDetails' => $err
         ]);
      }
   }

   function deleteProducto(){
      $this->validar($this->request(), [
         'nuevo' => 'present|boolean',
         'id' => 'present',
         'nombre' => 'required',
         'codigo' => 'required',
         'precio' => 'required',
         'descripcion' => 'required',
         'cantidad' => 'required'
      ]);

      $req = $this->request();
      $this->DB->beginTransaction();

      try {

       
            $this->Producto->deleteProducto($req);
            $this->DB->commit();

         $this->responder([
            'result' => true,
            'message' => "Producto $accion con exito"
         ]);
         
      } catch (\PDOException $err) {
         $this->DB->rollBack();
         $this->responder([
            'result' => false,
            'message' => 'Ocurrió un error al intentar guardar los datos',
            'errorDetails' => $err
         ]);
      }
   }


}
