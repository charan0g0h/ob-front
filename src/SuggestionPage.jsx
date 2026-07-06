import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    ArrowRight,
    ArrowUp,
    ArrowDown,
    RefreshCw,
    Sparkles,
    LoaderCircle
} from "lucide-react";

export default function SuggestionPage() {

    const location = useLocation();
    const nav = useNavigate()
    const {
        featureImportance = {},
        userData = {}
    } = location.state || {};

    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
            if(!location.state){
                nav("/")
            }
    },[])

    useEffect(() => {

        async function getSuggestions() {
            console.log(location.state)
            console.log(userData)
            try {

                const response = await fetch("http://127.0.0.1:8000/suggest", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(location.state)
                });

                const data = await response.json();

                setSuggestions(data.suggestions || []);

            } catch (err) {
                console.log(err);
            }

            setLoading(false);
        }

        getSuggestions();

    }, []);

    const getDirectionIcon = (direction) => {

        if (direction === "increase")
            return <ArrowUp className="text-green-500" size={22} />;

        if (direction === "decrease")
            return <ArrowDown className="text-red-500" size={22} />;

        return <RefreshCw className="text-blue-500" size={20} />;
    };

    const getDirectionColor = (direction) => {

        if (direction === "increase")
            return "from-green-500 to-emerald-500";

        if (direction === "decrease")
            return "from-red-500 to-orange-500";

        return "from-blue-500 to-cyan-500";
    };

    function returntopredict(){
        location.state = null
        nav("/")
    }

    const featureLabels = {
    Gender: "Gender",
    Age: "Age",
    Height: "Height",
    Weight: "Weight",
    family_history_with_overweight: "Family History of Overweight",
    FAVC: "Frequent High-Calorie Food Consumption",
    FCVC: "Vegetable Consumption scale(0-3)",
    NCP: "Number of Main Meals",
    CAEC: "Food Between Meals (Snacking)",
    SMOKE: "Smoking",
    CH2O: "Daily Water Intake",
    SCC: "Calories Monitoring",
    FAF: "Physical Activity scale(0-3)",
    TUE: "Technology Usage Time scale(0-3)",
    CALC: "Alcohol Consumption",
    MTRANS: "Transportation Method"
};

    return (

        <div className="min-h-screen bg-gradient-to-br from-slate-700 via-blue-950 to-slate-400 p-6">

            <div className="max-w-6xl mx-auto">

                <div className="text-center mb-12">

                    <h1 className="text-5xl font-bold text-white flex justify-center items-center gap-3">

                        

                        Personalized Suggestions

                    </h1>

                    <p className="text-slate-400 mt-4 text-lg">

                        Improve your health by moving each feature towards the recommended value.

                    </p>

                </div>

                {
                    loading ?

                        <div className="flex justify-center items-center h-[400px]">

                            <LoaderCircle
                                className="animate-spin text-cyan-400"
                                size={60}
                            />

                        </div>

                        :

                        <div className="grid lg:grid-cols-2 gap-8">

                            {
                                suggestions.map((item, index) => (

                                    <div
                                        key={index}
                                        className="group relative overflow-hidden rounded-3xl bg-gray-900 border-2 border-slate-700 hover:border-cyan-500 transition-all duration-500 hover:scale-[1.02]"
                                    >

                                        <div
                                            className={`absolute top-0 left-0 h-2 w-full bg-gradient-to-r ${getDirectionColor(item.direction)}`}
                                        />

                                        <div className="p-7">

                                            <div className="flex justify-between items-center mb-8">

                                                <div>

                                                    <h2 className="text-2xl font-bold text-white">

                                                       {featureLabels[item.feature] || item.feature}

                                                    </h2>

                                                    <p className="text-slate-400 mt-1">

                                                        Suggested Improvement

                                                    </p>

                                                </div>

                            

                                            </div>

                                            <div className="flex justify-center items-center gap-6 flex-wrap">

                                                <div className="text-center">

                                                    <p className="text-slate-400 mb-2">

                                                        Current

                                                    </p>

                                                    <div className="bg-slate-800 rounded-xl px-6 py-5 text-3xl font-bold text-white">

                                                        {item.current}

                                                    </div>

                                                </div>

                                                <div className="flex flex-col items-center">

                                                    {getDirectionIcon(item.direction)}

                                                    <ArrowRight
                                                        className="text-cyan-400 animate-pulse mt-2"
                                                        size={34}
                                                    />
                                                </div>

                                                <div className="text-center">

                                                    <p className="text-slate-400 mb-2">

                                                        Target

                                                    </p>

                                                    <div
                                                        className={`rounded-xl px-6 py-5 text-3xl font-bold text-white bg-gradient-to-r ${getDirectionColor(item.direction)}`}
                                                    >

                                                        {item.target}

                                                    </div>

                                                </div>

                                            </div>

                                            {
                                                item.difference !== undefined &&

                                                <div className="mt-8">

                                                    <div className="flex justify-between text-sm mb-2">

                                                        <span className="text-slate-400">

                                                            Difference

                                                        </span>

                                                        <span className="text-white font-semibold">

                                                            {item.difference}

                                                        </span>

                                                    </div>

                                                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">

                                                        <div
                                                            className={`h-full rounded-full bg-gradient-to-r ${getDirectionColor(item.direction)} animate-pulse`}
                                                            style={{
                                                                width: `${Math.min(item.difference * 15,100)}%`
                                                            }}
                                                        />

                                                    </div>

                                                </div>

                                            }

                                        </div>

                                    </div>

                                ))
                            }

                        </div>

                }

            </div>
            <div className="w-full flex p-7 justify-end">
                <button onClick={returntopredict} className="w-60 h-10 bg-gradient-to-br text-white from-red-700 hover:cursor-pointer font-extrabold to-red-400">logout</button>
            </div>
            

        </div>

    );

}