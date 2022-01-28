import React, {useContext} from "react";
import {Web3Context} from "@components/providers/Web3Provider"

export default function useWeb3() {

    // I can include othere methods for updating data and such.

    return useContext(Web3Context)
}