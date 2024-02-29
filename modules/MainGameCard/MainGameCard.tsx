import React from 'react'
import { Card } from '../ui/Card/Card'
import { Text } from '../ui/Text/Text'
import { GuessBox } from './GuessBox/GuessBox'

export const MainGameCard = () => {
  return (
    <Card>
        <Text variant='danger'>Tu jakis searchbar</Text>
        <div className='px-2 py-4 flex flex-row space-x-2 w-72 justify-between md:w-full overflow-auto'>
          <GuessBox result='correct'/>
          <GuessBox result='correct'/>
          <GuessBox result='partial'/>
          <GuessBox result='partial'/>
          <GuessBox result='incorrect'/>
        </div>
        <Text variant='danger'>I tutaj wyniki</Text>
    </Card>
  )
}
