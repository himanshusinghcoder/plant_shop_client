import { Navigate, useRoutes } from 'react-router-dom'
import Home from './pages/Home';
import Product from './pages/product';
import AdminProduct from './pages/admin/product';
import User from './layouts/user';
import Admin from './layouts/admin';
import Products from './pages/admin/products';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { ACCESS_LEVELS } from './constant';
import AllUsers from './pages/admin/users';
import AdminUser from './pages/admin/user';
import HomeManager from './pages/admin/home_manager';
import BannerManger from './pages/admin/banner_mananger';
import AllProducts from './pages/products';
import Cart from './pages/Cart';
import CheckoutCart from './pages/checkout_cart';
import Orders from './pages/orders';

function Routes() {
    const user = useSelector(state => state.user.userData)
    let element = useRoutes([
        {
            path: '/',
            element: <User />,
            children: [
                {
                    path: '/',
                    element: <Navigate to={'/home'} />
                },
                {
                    path: '/home',
                    element: <Home />
                },
                {
                    path: '/profile/:user_id',
                    element: <AdminUser />
                },
                {
                    path:'/products',
                    element: <AllProducts />, 
                },
                {
                    path: '/product/:product_id',
                    element: <Product />
                },
                {
                    path: '/cart',
                    element: <Cart />
                },
                {
                    path: '/wishlist',
                    element: <AllProducts />
                },
                {
                    path: '/checkout',
                    element: <CheckoutCart />
                },
                {
                    path: '/orders/:user_id',
                    element: <Orders />
                },
                {
                    path: '/login',
                    element: isEmpty(user)  ? <Login /> : <Navigate to={-1} />
                },
                
            ]
        },
        {
            path: '/admin/',
            element: <Admin />,
            children: [
                {
                    element: <ProtectedRoute access_level={ACCESS_LEVELS.ADMIN} />,
                    children: [
                        {
                            path: 'products',
                            element: <Products />
                        },
                        {
                            path: 'product',
                            element: <AdminProduct />
                        },
                        {
                            path: 'product',
                            element: <AdminProduct />
                        },
                        {
                            path: 'product/:product_id',
                            element: <AdminProduct />
                        },
                        {
                            path: 'users',
                            element: <AllUsers />
                        },
                        {
                            path: 'user',
                            element: <AdminUser />
                        },
                        {
                            path: 'user/:user_id',
                            element: <AdminUser />
                        },
                        {
                            path: 'home_manager',
                            element: <HomeManager />
                        },
                        {
                            path: 'home_manager/banner',
                            element: <BannerManger />
                        },
                        {
                            path:'home_manager/featured_product',
                            element: <Products />
                        }
                    ]
                },
            ]
        },
        {
            path: '*',
            element: <Navigate to={-1} />
        }
    ]);
    return element
}

export default Routes