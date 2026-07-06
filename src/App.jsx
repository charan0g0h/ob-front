import { Route, Routes } from "react-router-dom"
import Prediction from "./Prediction"
import SuggestionPage from "./SuggestionPage"

function App() {
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Prediction></Prediction>}></Route>
        <Route path="/suggest" element={<SuggestionPage></SuggestionPage>}> </Route>
      </Routes>
    </>
  )
}

export default App
