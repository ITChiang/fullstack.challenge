import React, { ReactElement, useContext, useMemo, useState } from 'react'
import { DateTime } from 'luxon'

import greeting from 'lib/greeting'


import Calendar from 'src/models/Calendar'
import Event from 'src/models/Event'
import AccountContext from 'src/context/accountContext'

import List from './List'
import EventCell from './EventCell'
import SelectMenu from './SelectMenu'

import style from './style.scss'

type AgendaItem = {
  calendar: Calendar
  event: Event
}

const compareByDateTime = (a: AgendaItem, b: AgendaItem) =>
  a.event.date.diff(b.event.date).valueOf()

/**
 * Agenda component
 * Displays greeting (depending on time of day)
 * and list of calendar events
 */

const Agenda = (): ReactElement => {
  const account = useContext(AccountContext)
  const events: AgendaItem[] = useMemo(
    () =>
      account.calendars
        .flatMap((calendar) =>
          calendar.events.map((event) => ({ calendar, event })),
        )
        .sort(compareByDateTime),
    [account],
  )
  const title = useMemo(() => greeting(DateTime.local().hour), [DateTime.local().hour])
  const [currentFilter, setFilter] = useState("LIST_ALL");
  const [grouped, setGrouped] = useState(false);
  const newEvents: AgendaItem[] = useMemo(() => events.filter(e => e.calendar.id === currentFilter || currentFilter === "LIST_ALL"), [currentFilter, account]);
  const groupedEvents: any = newEvents.reduce((groups: any, item: any) => {
    const group = (groups[item.event.department] || []);
    group.push(item);
    groups[item.event.department] = group;
    return groups;
  }, {});

  const eventsHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.currentTarget.value);
  }
  const groupHanlder = (): void => {
    grouped ? setGrouped(false) : setGrouped(true);
  }

  const groupedList =
    Object.keys(groupedEvents).map((department:string) => {
      return (
        <div>
          <span className={style.subTitle}>{department!=="undefined"?department:"Uncategorized"}</span>
          <hr />
          <List>
            {groupedEvents[department].map(({ calendar, event }: any) => (
              <EventCell key={event.id} calendar={calendar} event={event} />
            ))}
          </List>
        </div>
      )
    })
  const unGroupList =
    <List>
      {newEvents.map(({ calendar, event }) => (
        <EventCell key={event.id} calendar={calendar} event={event} />
      ))}
    </List>
  const listContainer = grouped ? groupedList : unGroupList;
  //--------------
  return (
    <div className={style.outer}>
      <div className={style.container}>
        <div className={style.header}>
          <span className={style.title}>{title}</span>
        </div>
        <div className={style.navBar}>
          <button className={`${grouped ? style.unActive : style.active} ${style.button}`} onClick={groupHanlder}>Group</button>
          <SelectMenu options={account.calendars} selectHandler={eventsHandler} />
        </div>
        {listContainer}
      </div>
    </div>
  )
}

export default Agenda
