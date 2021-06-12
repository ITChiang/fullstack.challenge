import React, { ReactElement, useState } from 'react'
import Calendar from 'src/models/Calendar'
import style from './style.scss'

/**
 * Agenda section header component
 */

interface Props {
  options: Calendar[],
  selectHandler: Function
}

const SelectMenu = ({ options, selectHandler }: Props): ReactElement => {
  const optionsList = options.map((e, index) => (
    <option className={style.option} value={e.id} key={"option_" + index}>{"Calendar " + index}</option>
  ))

  return (
    <div className={style.container}>
      <select className={style.select} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => selectHandler(e)}>
        <option className={style.option}  value="LIST_ALL" key={"option_0"}>ALL</option>
        {optionsList}
      </select>
    </div>)
}

export default SelectMenu
