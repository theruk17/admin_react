import { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from './components/Navbar'
import { NumericFormat } from 'react-number-format';
import reactLogo from './assets/react.svg'
import './App.css'

const API_URL = 'https://drab-jade-haddock-toga.cyclic.app/monitor'

const Head_table = [
  { name: 'Brand' },
  { name: 'Model' },
  { name: 'Size' },
  { name: 'Refresh Rate' },
  { name: 'Panel' },
  { name: 'Resolution' },
  { name: 'Curve' },
  { name: 'Status' },
  { name: 'SRP' },
  { name: 'Price' },
  { name: 'Action' },

]

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true)
    axios.get(API_URL)
      .then(res => {
        setData(res.data)
        setLoading(false)
      })
  }, []);

  return (
    <div>
      <Navbar />
      <div className="mx-auto max-w-full py-4 px-10 ">
        <div className="container mx-auto bg-white shadow rounded-lg mb-2">
          <div className="px-4 py-5 sm:px-6">
            <table className="table-auto rounded-lg w-full text-black">
              <thead>
                <tr className='bg-gray-200 text-gray-700'>
                {Head_table.map((item) => (
                  <th key={item.name} className='px-4 py-2 border border-slate-600'>{item.name}</th>
                ))}
                </tr>
              </thead>
              <tbody>
                {data.map(item => (
                <tr key={item.mnt_id} className='hover:bg-gray-100 text-sm'>
                  <td className='border border-slate-700 px-2 py-2'>{item.mnt_brand}</td>
                  <td className='border border-slate-700 px-2 py-2'>{item.mnt_model}</td>
                  <td className='border border-slate-700 px-2 py-2'>{item.mnt_size}</td>
                  <td className='border border-slate-700 px-2 py-2'>{item.mnt_refresh_rate}</td>
                  <td className='border border-slate-700 px-2 py-2'>{item.mnt_panel}</td>
                  <td className='border border-slate-700 px-2 py-2'>{item.mnt_resolution}</td>
                  <td className='border border-slate-700 px-2 py-2'>{item.mnt_curve}</td>
                  <td className='border border-slate-700 px-2 py-2'>{item.mnt_status}</td>
                  <td className='border border-slate-700 px-2 py-2 text-right'><NumericFormat value={item.mnt_price_srp} thousandSeparator="," displayType="text" />.-</td>
                  <td className='border border-slate-700 px-2 py-2 text-right'><NumericFormat value={item.mnt_price_w_com} thousandSeparator="," displayType="text" />.-</td>
                  <td className='border border-slate-700 px-2 py-2 text-center'>Edit</td>
                </tr>
                ))}
                
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  )
}

export default App
