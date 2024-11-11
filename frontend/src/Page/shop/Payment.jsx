import {useEffect, useState} from "react";
import {fetchTokenData} from "../../Server/ApiService";

function Payment(){
    const [testData,setTestData] = useState()
    useEffect(() => {
        fetchTokenData("/mypage/cart/checkout").then((res)=>{
            setTestData(res.data);
        })
    }, []);

    console.log(testData)

    return(
        <div>
            결제페이지
            <form>

            </form>
        </div>
    )
}
export default Payment;