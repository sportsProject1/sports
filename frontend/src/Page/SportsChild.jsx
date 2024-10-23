import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";


function SportsChild() {
    const {sport} = useParams()

    const [sportItem,setSportItem] = useState("")
    console.log(sport)

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

    return(
        <div>
            <ul>
                <li>
                    {sportItem}
                </li>
            </ul>
        </div>
    )
}
export default SportsChild