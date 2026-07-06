import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Cell
} from "recharts";

export default function Prediction() {
  const nav = useNavigate()
  const [prediction, setPrediction] = useState("");
  const [probabilities, setProbabilities] = useState([]);
  const [chartdata , setChatdata] = useState([])
    const mappings = {
  Gender: {
    Female: 0,
    Male: 1,
  },

  family_history_with_overweight: {
    no: 0,
    yes: 1,
  },

  FAVC: {
    no: 0,
    yes: 1,
  },

  CAEC: {
    no: 0,
    Sometimes: 1,
    Frequently: 2,
    Always: 3,
  },

  SMOKE: {
    no: 0,
    yes: 1,
  },

  SCC: {
    no: 0,
    yes: 1,
  },

  CALC: {
    no: 0,
    Sometimes: 1,
    Frequently: 2,
    Always: 3,
  },

  MTRANS: {
    Automobile:4 ,
    Bike: 1,
    Motorbike: 2,
    Public_Transportation: 3,
    Walking: 0,
  },
};



  const [formData, setFormData] = useState({
    Gender: "Male",
    Age: "",
    Height: "",
    Weight: "",
    family_history_with_overweight: "yes",
    FAVC: "yes",
    FCVC: "",
    NCP: "",
    CAEC: "Sometimes",
    SMOKE: "no",
    CH2O: "",
    SCC: "no",
    FAF: "",
    TUE: "",
    CALC: "no",
    MTRANS: "Public_Transportation",
  });
 
  const convertToNumeric = (data) => {
  const converted = { ...data };

  Object.keys(mappings).forEach((key) => {
    converted[key] = mappings[key][converted[key]];
  });

  return converted;
};


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.type === "number"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handlenavigate = () => {
    console.log(formData)
    nav("/suggest" , {
      state : convertToNumeric(formData)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericData = convertToNumeric(formData);
    try {
      const response = await fetch(" https://obesity-1.onrender.com/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(numericData),
      });
      if(response == 422){

      }else{
        const data = await response.json();
      const probs = data.probability;
      console.log(probs)
        setPrediction(data.prediction);
        setProbabilities(probs);
        const Data = [
        {
            name: "Underweight",
            probability: (probs?.[0] ?? 0) * 100,
        },
        {
            name: "Normal",
            probability: (probs?.[1] ?? 0) * 100,
        },
        {
            name: "Overweight I",
            probability: (probs?.[2] ?? 0) * 100,
        },
        {
            name: "Overweight II",
            probability: (probs?.[3] ?? 0) * 100,
        },
        {
            name: "Obesity I",
            probability: (probs?.[4] ?? 0) * 100,
        },
        {
            name: "Obesity II",
            probability: (probs?.[5] ?? 0) * 100,
        },
        {
            name: "Obesity III",
            probability: (probs?.[6] ?? 0) * 100,
        },
        ];
        
        setChatdata(Data);
      }
      
            } catch (err) {
            console.log(err);
            }
  };

  const RadioGroup = ({ label, name }) => (
    <div>
      <label className="block font-semibold mb-2">{label}</label>

      <div className="flex gap-6">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name={name}
            value="yes"
            checked={formData[name] === "yes"}
            onChange={handleChange}
          />
          Yes
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            name={name}
            value="no"
            checked={formData[name] === "no"}
            onChange={handleChange}
          />
          No
        </label>
      </div>
    </div>
  );

  const suggestions = {
        Insufficient_Weight: [
            "Increase calorie intake with healthy foods.",
            "Consume more protein.",
            "Strength training 3-4 times/week.",
            "Consult a nutritionist."
        ],

        Normal_Weight: [
            "Maintain a balanced diet.",
            "Exercise regularly.",
            "Drink 2-3L water daily.",
            "Sleep at least 7 hours."
        ],

        Overweight_Level_I: [
            "Reduce sugary drinks.",
            "Walk 30 minutes daily.",
            "Increase vegetables.",
            "Avoid late-night meals."
        ],

        Overweight_Level_II: [
            "Create a calorie deficit.",
            "Cardio 5 days/week.",
            "Track your meals.",
            "Consult a dietician."
        ],

        Obesity_Type_I: [
            "Reduce processed foods.",
            "Exercise at least 45 mins.",
            "Increase protein intake.",
            "Medical consultation recommended."
        ],

        Obesity_Type_II: [
            "Structured weight loss plan.",
            "Consult an obesity specialist.",
            "Daily physical activity.",
            "Monitor blood pressure."
        ],

        Obesity_Type_III: [
            "Immediate medical consultation.",
            "Personalized diet program.",
            "Supervised exercise.",
            "Regular health monitoring."
        ]
    };

    const COLORS = [
      "#06B6D4", // Underweight - Cyan
      "#22C55E", // Normal - Green
      "#EAB308", // Overweight I - Yellow
      "#F97316", // Overweight II - Orange
      "#EF4444", // Obesity I - Red
      "#DC2626", // Obesity II - Dark Red
      "#7F1D1D", // Obesity III - Maroon
    ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-700 via-blue-950 to-slate-400 flex items-center justify-center px-3 sm:px-6 py-6 sm:py-10">
      <div className="bg-neutral-200 rounded-xl shadow-xl w-full max-w-7xl mx-4 lg:mx-8 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-5">
            <div className="lg:col-span-3 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r">
              <div className="pb-4 ">
                <h1 className="text-3xl font-bold ">
                  Obesity Prediction
                </h1>
                <h2>fill in the details given below to get your result</h2>
              </div>
                
        <form
          
          className="grid grid-cols-1 md:grid-cols-3 bg-neutral-200 gap-8 border-2 rounded-2xl border-neutral-300 p-4"

        >

          {/* Gender */}

          <div>
            <label className="block font-semibold mb-2">1. Gender</label>

            <div className="flex mt-4 gap-5">
              <label>
                <input
                  type="radio"
                  name="Gender"
                  value="Male"
                  checked={formData.Gender === "Male"}
                  onChange={handleChange}
                />
                <span className="ml-2">Male</span>
              </label>

              <label>
                <input
                  type="radio"
                  name="Gender"
                  value="Female"
                  checked={formData.Gender === "Female"}
                  onChange={handleChange}
                />
                <span className="ml-2">Female</span>
              </label>
            </div>
          </div>

          {/* Age */}

          <div>
            <label className="block font-semibold mb-2">2. Age</label>

            <input
              type="number"
              name="Age"
              value={formData.Age}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Height */}

          <div>
            <label className="block font-semibold mb-2">3. Height (m)</label>

            <input
              type="number"
              step="0.01"
              name="Height"
              value={formData.Height}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Weight */}

          <div>
            <label className="block font-semibold mb-2">4. Weight (kg)</label>

            <input
              type="number"
              step="0.1"
              name="Weight"
              value={formData.Weight}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <RadioGroup
            label="5. Family History with Overweight"
            name="family_history_with_overweight"
          />

          <RadioGroup
            label="6. Frequent High Calorie Food "
            name="FAVC"
          />

          {/* FCVC */}

          <div>
            <label className="block font-semibold mb-2">
               7. Vegetable Consumption scale(0-3)
            </label>

            <input
              type="number"
              step="0.1"
              min="1"
              max="5"
              name="FCVC"
              value={formData.FCVC}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* NCP */}

          <div>
            <label className="block font-semibold mb-2">
              8. Number of Main Meals 
            </label>

            <input
              type="number"
              step="0.1"
              name="NCP"
              value={formData.NCP}
              onChange={handleChange}
              className="w-full border mt-6 rounded-lg p-3"
            />
          </div>

          {/* CAEC */}

          <div>
            <label className="block font-semibold mb-2">
              9. Eating Between Meals
            </label>

            <select
              name="CAEC"
              value={formData.CAEC}
              onChange={handleChange}
              className="w-full border mt-6 rounded-lg p-3"
            >
              <option>no</option>
              <option>Sometimes</option>
              <option>Frequently</option>
              <option>Always</option>
            </select>
          </div>

          <RadioGroup label="10. Smoking" name="SMOKE" />

          {/* CH2O */}

          <div>
            <label className="block font-semibold mb-2">
              11. Water Intake in Liters 
            </label>

            <input
              type="number"
              step="0.1"
              name="CH2O"
              value={formData.CH2O}
              onChange={handleChange}
              className="w-full border  rounded-lg p-3"
            />
          </div>

          <RadioGroup
            label="12. Monitor Calories "
            name="SCC"
          />

          {/* FAF */}

          <div>
            <label className="block font-semibold mb-2">
              13. Physical Activity scale(0-3)
            </label>

            <input
              type="number"
              step="0.1"
              name="FAF"
              value={formData.FAF}
              onChange={handleChange}
              className="w-full border  rounded-lg p-3"
            />
          </div>

          {/* TUE */}

          <div>
            <label className="block font-semibold mb-2">
              14. Technology Usage  scale(0-3)
            </label>

            <input
              type="number"
              step="0.1"
              name="TUE"
              value={formData.TUE}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* CALC */}

          <div>
            <label className="block font-semibold mb-2">
             15. Alcohol Consumption 
            </label>

            <select
              name="CALC"
              value={formData.CALC}
              onChange={handleChange}
              className="w-full border mt-6 rounded-lg p-3"
            >
              <option>no</option>
              <option>Sometimes</option>
              <option>Frequently</option>
              <option>Always</option>
            </select>
          </div>

          {/* MTRANS */}

          <div className="md:col-span-2 xl:col-span-3">
            <label className="block font-semibold mb-2">
              16. Transportation
            </label>

            <select
              name="MTRANS"
              value={formData.MTRANS}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option>Public_Transportation</option>
              <option>Walking</option>
              <option>Automobile</option>
              <option>Bike</option>
              <option>Motorbike</option>
            </select>
          </div>

          
        </form>
          <div className="md:col-span-2 xl:col-span-3 mt-6">
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold font-semibold py-3 rounded-lg" type="submit"
              onClick={handleSubmit}
            >
              Predict
            </button>
          </div>
    
            </div>
            <div className="lg:col-span-2 p-4   bg-gradient-to-br from-slate-700 via-blue-950 to-slate-400">

            {prediction === "" ? (

                <div className="flex h-full items-center flex-col p-4 gap-10 bg-gradient-to-br from-slate-700 via-blue-950 to-slate-400 justify-center text-gray-500">
                    <div className=" bg-blue-100 h-fit rounded-2xl p-3 w-full">
                        <h1 className=" font-bold text-black">
                            Disclamer: This prediction is based on the provided data and should not replace professinal advice
                        </h1>
                    </div>

                    <h1 className="text-neutral-200">Nearly 1 in 3 women (30.7%) and more than 1 in 4 men (27.3%) aged
                         15–49 in India are overweight or obese, according to the latest NFHS-6 (2023–24).</h1>
                    <h1 className="text-neutral-200">
                        Childhood overweight and obesity have also increased: among children under 5, prevalence 
                        rose from 1.5% to 3.4% between 2005–06 and 2019–21
                    </h1>
                    <div className=" basis-128  w-full">
                        <div className="bg-gradient-to-br from-slate-700 via-blue-950 to-slate-400 rounded-2xl shadow-lg border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-5">
                                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                🧠
                                </div>
                                <div>
                                <h2 className="text-xl font-bold text-gray-800 text-white">Model Insights</h2>
                                <p className="text-sm text-gray-500">
                                    Information about the prediction model
                                </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-gray-300 rounded-xl p-4">
                                <p className="text-sm text-gray-500">Model</p>
                                <h3 className="text-lg font-semibold">Neural Network</h3>
                                </div>

                                <div className="bg-gray-300 rounded-xl p-4">
                                <p className="text-sm text-gray-500">Architecture</p>
                                <h3 className="text-lg font-semibold">16 → 256 → 512 → 512 → 7 </h3>
                                </div>

                                <div className="bg-gray-300 rounded-xl p-4">
                                <p className="text-sm text-gray-500">Activation</p>
                                <h3 className="text-lg font-semibold">ReLU + Softmax</h3>
                                </div>

                                <div className="bg-gray-300 rounded-xl p-4">
                                <p className="text-sm text-gray-500">Optimizer</p>
                                <h3 className="text-lg font-semibold">Adam</h3>
                                </div>

                                <div className="bg-gray-300 rounded-xl p-4">
                                <p className="text-sm text-gray-500">Loss Function</p>
                                <h3 className="text-lg font-semibold">Categorical Crossentropy</h3>
                                </div>

                                <div className="bg-gray-300 rounded-xl p-4">
                                <p className="text-sm text-gray-500">Training Accuracy</p>
                                <h3 className="text-lg font-semibold">90.05%</h3>
                                </div>
                            </div>

                            <div className="mt-5 rounded-xl bg-blue-50 border border-blue-200 p-4">
                                <h4 className="font-extrabold text-blue-800  mb-2">Prediction Output</h4>
                                <p className="text-gray-700 text-sm leading-6">
                                The model analyzes <strong>16 health and lifestyle features</strong>,
                                including age, BMI, physical activity, water intake, eating habits, and
                                family history. It predicts the probability of belonging to one of the
                                seven obesity categories. The class with the highest probability is
                                selected as the final prediction.
                                </p>
                            </div>
                            </div>
                    </div>
                    

                </div>

            ) : (

                <>
                    <div className="bg-blue-100 flex flex-col justify-center rounded-xl min-h-[160px] p-5 text-center">

                        <p className="text-sm uppercase">
                            Predicted Result
                        </p>

                        <h1 className="text-3xl font-bold mt-2">
                            {prediction.replaceAll("_", " ")} 
                        </h1>
                        <h2>
                            with confidence: {Math.floor(Math.max(...probabilities)*100)}%
                        </h2>

                    </div>

                    <div className="h-72 sm:h-80 md:h-96 mt-4 bg-neutral-100 rounded-3xl pb-8">

                        <ResponsiveContainer width="100%" height="100%">

                            <BarChart 
                            width={500}
                            height={300}
                            data={chartdata}>

                                <CartesianGrid strokeDasharray="3 3"/>

                                <XAxis
                                    dataKey="name"
                                    angle={-20}
                                    textAnchor="end"
                                    interval={0}
                                />

                                <YAxis
                                    unit="%"
                                />

                                <Tooltip/>

                                <Bar
                                    dataKey="probability"
                        
                                    radius={[8,8,0,0]}
                                >
                                    {chartdata.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index]}
                                  />
                                ))}
                                </Bar>
                                    
                                
                                
                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                    <div className="mt-8 rounded-3xl bg-blue-200 p-6 font-bold">

                        <h3 className="font-bold text-xl flex gap-2 mb-3">
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path d="M12 .75a8.25 8.25 0 0 0-4.135 15.39c.686.398 1.115 1.008 1.134 1.623a.75.75 0 0 0 .577.706c.352.083.71.148 1.074.195.323.041.6-.218.6-.544v-4.661a6.714 6.714 0 0 1-.937-.171.75.75 0 1 1 .374-1.453 5.261 5.261 0 0 0 2.626 0 .75.75 0 1 1 .374 1.452 6.712 6.712 0 0 1-.937.172v4.66c0 .327.277.586.6.545.364-.047.722-.112 1.074-.195a.75.75 0 0 0 .577-.706c.02-.615.448-1.225 1.134-1.623A8.25 8.25 0 0 0 12 .75Z" />
                            <path fillRule="evenodd" d="M9.013 19.9a.75.75 0 0 1 .877-.597 11.319 11.319 0 0 0 4.22 0 .75.75 0 1 1 .28 1.473 12.819 12.819 0 0 1-4.78 0 .75.75 0 0 1-.597-.876ZM9.754 22.344a.75.75 0 0 1 .824-.668 13.682 13.682 0 0 0 2.844 0 .75.75 0 1 1 .156 1.492 15.156 15.156 0 0 1-3.156 0 .75.75 0 0 1-.668-.824Z" clipRule="evenodd" />
                          </svg>
                          Suggestions
                        </h3>

                        <ul className="list-disc ml-5 space-y-2">

                            {suggestions[prediction].map((item) => {
                                return(
                                    <li className="font-mono ">{item}</li>
                                )
                            })}

                        </ul>
                        <h1 className="justify-center font-extrabold underline flex text-blue-600 
                        p-4 hover:cursor-pointer hover:text-blue-400" onClick={handlenavigate}>click for more 
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                          <path fillRule="evenodd" d="M8.25 3.75H19.5a.75.75 0 0 1 .75.75v11.25a.75.75 0 0 1-1.5 0V6.31L5.03 20.03a.75.75 0 0 1-1.06-1.06L17.69 5.25H8.25a.75.75 0 0 1 0-1.5Z" clipRule="evenodd" />
                        </svg>
                        </h1>
                    </div>

                </>

            )}

        </div>
        </div>
        
      </div>
    </div>
  );
}