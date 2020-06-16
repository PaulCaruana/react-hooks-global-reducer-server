import { dispatch, useGlobalState } from "../Store";

const useCounter = () => {
    const increment = () => dispatch({ type: "increment" });
    const decrement = () => dispatch({ type: "decrement" });
    const [count] = useGlobalState("count");
    return {count, increment, decrement};
};

export default useCounter;