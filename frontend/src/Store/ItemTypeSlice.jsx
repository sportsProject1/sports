import { createSlice } from "@reduxjs/toolkit";

const itemTypeSlice = createSlice({
    name: "itemType",
    initialState: {
        itemType: "card" // 초기 상태 설정
    },
    reducers: {
        ListType: (state) => {
            state.itemType = "list"; // 상태를 직접 수정
        },
        CardType: (state) => {
            state.itemType = "card"; // 상태를 직접 수정
        }
    }
});

export const { ListType, CardType } = itemTypeSlice.actions;
export default itemTypeSlice.reducer;
