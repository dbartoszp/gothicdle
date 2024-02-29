import { Text } from "@/modules/ui/Text/Text"
import clsx from "clsx"

type GuessBoxProps = {
    result: string
}

export const GuessBox = ({result}:GuessBoxProps) => {
const boxClasses = clsx('aspect-square w-24 h-24 border border-default-border flex items-center justify-center',{"bg-green-700":result==='correct',"bg-red-700":result==='incorrect',"bg-orange-700":result==='partial'})

  return (
    <div className={boxClasses}><Text>{result}</Text></div>
  )
}
