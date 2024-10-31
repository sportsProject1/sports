import {useEffect, useState} from "react";
import {fetchTokenData} from "../../Server/ApiService";
import {useSelector} from "react-redux";

function ShopCart(){
    const [userCart,setUserCart] = useState([])
    const token = useSelector((state) => state.auth.token)
    useEffect(() => {
        fetchTokenData("/mypage/cart",setUserCart)
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
    }, []);

    return(
        <div>

            <h1>장바구니</h1>

            <table>
                <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Date of Birth</th>

                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>James</td>
                    <td>Matman</td>
                    <td>(713) 123-8965</td>
                    <td><a href="mailto:jmatman@stewart.com">jmatman@stewart.com</a></td>
                    <td>01/13/1979</td>
                </tr>
                </tbody>
            </table>

        </div>
    )
}

export default ShopCart;