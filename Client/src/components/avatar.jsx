const avatar = ({ name }) => {
  const firstLetter = name?.charAt(0).toUpperCase() || "?";
  const colors = [
  '#F87171', 
  '#FBBF24', 
  '#34D399', 
  '#60A5FA', 
  '#A78BFA', 
  '#F472B6', 
  '#FCD34D', 
  '#38BDF8', 
  '#4ADE80', 
  '#C084FC'  
];
  const randomNum = Math.floor(Math.random() * 10) 
  return (
    <div className="w-20 h-20 rounded-full text-white flex items-center justify-center text-2xl font-bold" style= {{background: colors[randomNum]}}>
      {firstLetter}
    </div>
  );
};

export default avatar