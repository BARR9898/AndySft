angular
    .module('app')
    .controller('ProductosController', function($scope, $http, $mdDialog, $mdToast, $timeout, FlashService) {
        let vm = $scope;

        vm.filtro = {
            coincidencia: '',
            estatus: 'x',
            sucursal: 'x',
            rol: 'x',
            pagina: 1,
            items: 25
        };

        vm.ultimoFiltro = {
            coincidencia: '',
            estatus: 'x',
            sucursal: 'x',
            rol: 'x',
            pagina: 1,
            items: 25
        };

        vm.productos = [];
        vm.paginacion = {
            pagina: 1,
            paginas: 0,
            rango: [],
            total: 0
        };



        // Filtros
        vm.$watch('filtro.items', (newValue, oldValue) => {
            if (newValue != oldValue) {
                vm.ultimoFiltro.items = vm.filtro.items = Number(newValue);
                if (vm.filtro.pagina != 1) vm.filtro.pagina = 1;
                else BuscarUsuarios();
            }
        });

        vm.$watch('filtro.pagina', (newValue, oldValue) => {
            if (newValue != oldValue) {
                vm.ultimoFiltro.pagina = vm.filtro.pagina = newValue;
                BuscarUsuarios();
            }
        });

        vm.aplicarFiltros = () => {
            Object.assign(vm.ultimoFiltro, vm.filtro);
            vm.ultimoFiltro.pagina = 1;
            BuscarUsuarios();
        }

        (init = async() => {
            await BuscarProductos();
            //await BuscarUsuarios();
        })();

        async function BuscarProductos() {
            FlashService.Loading();
            await $http.get(`${API_ENDPOINT}productos`)
                .then(res => {
                    if (!res.data.result) return mensaje('Ocurrió un error al solicitar los datos')
                    if (!res.data.data.length) {
                        vm.productos = [];
                        vm.paginacion = res.data.paginacion;
                        mensaje('No existen usuarios con los criterios de búsqueda')
                    }
                    vm.productos = res.data.data;
                    vm.paginacion = res.data.paginacion;
                })
                .catch(handleCatch)
                .finally(() => {
                    FlashService.Loaded();
                    $timeout(() => $scope.$apply(), 10);
                });
        }



        /*async function BuscarRoles() {
            FlashService.Loading();
            await $http.get(`${API_ENDPOINT}roles`)
                .then(res => {
                    if (!res.data.result) return mensaje('Ocurrió un error al solicitar los datos')
                    if (!res.data.data.length) {
                        vm.selects.roles = [];
                        vm.paginacion = res.data.paginacion;
                        return mensaje('No existen roles con los criterios de búsqueda')
                    }
                    vm.selects.roles = res.data.data;
                    vm.paginacion = res.data.paginacion;
                })
                .catch(handleCatch)
                .finally(() => {
                    FlashService.Loaded();
                    $timeout(() => $scope.$apply(), 10);
                });
        }*/

        // Dialogo
        vm.DetallesProducto = (nuevo, item = {}) => {
            vm.editarItem = {...item };
            vm.editarItem.nuevo = nuevo; // editar = false, nuevo = true
            $mdDialog.show({
                    controller: DialogoDetallesProductoController,
                    templateUrl: 'modulos/productos/dialogo-detalles-producto.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: true
                })
                .then((res) => {
                    if (res) BuscarProductos();
                }, () => {});
        }

        function DialogoDetallesProductoController($scope, $mdDialog, FlashService) {
            $scope.producto = {
                nuevo: true,
                id: null,
                codigo: '',
                nombre: '',
                precio: '',
                cantidad: '',
                descripcion: ''

            };



            Object.assign($scope.producto, vm.editarItem);

            $scope.GuardarProducto = () => {
                if ($scope.producto.nuevo) Object.assign($scope.producto, vm.editarItem);
                FlashService.Loading();

                let producto = {...$scope.producto };

                $http.post(`${API_ENDPOINT}producto`, producto)
                    .then(res => {
                        console.log(res);
                        mensaje(res.data.message);
                        if (!res.data.result) return;
                        $mdDialog.hide(true);
                    })
                    .catch(handleCatch)
                    .finally(() => {
                        FlashService.Loaded();
                        $timeout(() => $scope.$apply(), 10);
                    });
            }

            $scope.EliminarProducto = () => {
                let producto = {...$scope.producto };
                $http.get(`${API_ENDPOINT}producto`, producto)
                    .then(res => {
                        console.log(res);
                        mensaje(res.data.message);
                        if (!res.data.result) return;
                        $mdDialog.hide(true);
                    })
                    .catch(handleCatch)
                    .finally(() => {
                        FlashService.Loaded();
                        $timeout(() => $scope.$apply(), 10);
                    });
            }

            $scope.respuesta = (res) => $mdDialog.hide(res);
        }

        function mensaje(msg, time = 2500) {
            $mdToast.show(
                $mdToast.simple()
                .textContent(msg)
                .hideDelay(time)
            );
        }

        function toParams(obj) {
            let str = '';
            for (let key in obj) {
                if (str != '') str += '&';
                str += key + '=' + obj[key];
            }
            return '?' + str;
        }

        function handleCatch(err) {
            const msg = err.data.hasOwnProperty('message') ?
                err.data.message :
                'Ocurrió un error al establecer la conexión'
            mensaje(msg);
            console.error(err);
        }
    });