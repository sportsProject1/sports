
export const handleChange = (e,state,setState) => {
    const { name, value } = e.target;
    setState({...state, [name]: value});
    // name값이 일치한 input 데이터 수정
}