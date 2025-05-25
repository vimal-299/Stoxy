import {TrendingDown,TrendingUp} from 'lucide-react'

const stockcard = ({ name,symbol,price,percent,color }) => {
  const Icon_dec = percent>0? TrendingUp:TrendingDown
  return (
    <>
      <div className="h-[18vh] min-w-[18vw] rounded-lg m-2 mr-2" >

        <div className={`flex h-[11vh] w-[18vw] border-l-[6px] ${percent>=0?'border-green-500':'border-red-500'} rounded-md`} style={{ background: color }}>

        <div>
          <h1 className= {` pt-2 pl-4 w-[12vw] ${name?.length>20?'text-xs':'text-base'}`} > {name} </h1>
          <h3 className='pl-4 text-sm'>{symbol}</h3>
        </div>

        <div className='ml-auto mr-7 mt-5'>
          <Icon_dec className={`${percent>=0?'text-green-500':'text-red-500'}`} size={28} />
        </div>

        </div>

        <div className={`h-[7vh] w-[18vw] bg-white border-l-[6px] ${percent>=0?'border-green-500':'border-red-500'}  rounded-md flex`}>
          <h1 className='pt-2 pl-4'>₹{price}</h1>
          <h1 className='pt-2 ml-auto mr-3'>{percent}%</h1>
        </div>


      </div>
    </>
  )
}

export default stockcard