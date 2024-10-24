import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import Pagination from "../Components/Pagination";



function SportsChild() {
    const {sport} = useParams()

    const [sportItem,setSportItem] = useState("")

    const [testList,setTestList] = useState([1,2,3,4,5,6,7,8,9,10,11,12,13,14])

    useEffect(() => {
        switch (sport) {
            case 'soccer':
                setSportItem("soccer");
                break;
            case 'basketball':
                setSportItem("basketball");
                break;
            case 'pingpong':
                setSportItem("pingpong");
                break;
            case 'badminton':
                setSportItem("badminton");
                break;
            default:
                setSportItem("");
        }
    }, [sport]); // sport가 변경될 때마다 useEffect가 호출됩니다.

    const [items, setItems] = useState([]); // 데이터베이스에서 받아올 아이템 리스트
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // 페이지네이션 관련 로직
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = testList.slice(indexOfFirstItem, indexOfLastItem);

    return(
        <div>
            <ul>
                {currentItems.map((item,index) => {
                    return (
                        <li key={index}>{sportItem}</li>
                    )
                })}
            </ul>

            <Pagination
                totalItems={testList.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
        </div>
    )
}
export default SportsChild