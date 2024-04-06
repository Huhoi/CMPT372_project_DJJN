import { AmountType, Ingredient } from '@/app/utils/interfaces'
import React, { useState } from 'react'

function Details({ iid, ingredient_name }: Ingredient) {

  {/* TODO: Make controlled inputs */}

  const [amount, setAmount] = useState(0);
  const [amountType, setAmountType] = useState(AmountType.GRAM);

  return (
    <>
        <div className="flex justify-between">
            <input value={ingredient_name}
                required
                readOnly
                className="mt-2 bg-slate-200 appearance-none border-2 border-slate-300 rounded w-4/12 py-2 px-4 text-slate-400 leading-tight focus:outline-none"
                type="text"/>
            <div className='w-2/12'>
                <input value={amount}
                    required
                    className="mt-2 bg-slate-200 appearance-none border-2 border-slate-300 rounded w-1/2 py-2 px-4 text-slate-600 leading-tight focus:outline-none focus:text-slate-950 focus:border-slate-400"
                    type="text"
                    placeholder="Amount" />
                <input value={amountType}
                    required
                    className="mt-2 bg-slate-200 appearance-none border-2 border-slate-300 rounded w-1/2 py-2 px-4 text-slate-600 leading-tight focus:outline-none focus:text-slate-950 focus:border-slate-400"
                    type="text"
                    placeholder="Unit" />
            </div>
        </div>
    </>
  )
}

export default Details