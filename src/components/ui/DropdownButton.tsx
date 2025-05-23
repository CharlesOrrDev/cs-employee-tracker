'use client'

import React, { useEffect, useState } from 'react'
import { Button } from './button';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';

const DropdownButton = ({ buttonType, changeSortBy, changeSortByJob, label, optionOne, optionTwo, optionThree }: { buttonType: string, changeSortBy: (value: string) => void, changeSortByJob: (value: string) => void, label: string, optionOne: string, optionTwo: string, optionThree: string }) =>
{
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectingDropdownOptions, setSelectingDropdownOptions] = useState(false);

  const [hoveringOptionOne, setHoveringOptionOne] = useState(false);
  const [hoveringOptionTwo, setHoveringOptionTwo] = useState(false);
  const [hoveringOptionThree, setHoveringOptionThree] = useState(false);

  const [sortingOptionOne, setSortingOptionOne] = useState<boolean>();
  const [sortingOptionTwo, setSortingOptionTwo] = useState<boolean>();
  const [sortingOptionThree, setSortingOptionThree] = useState<boolean>();

  const switchToOptionOne = () =>
  {
    handleDropdownOpen();
    setSortingOptionThree(false);
    setSortingOptionTwo(false);
    setSortingOptionOne(true);
  }

  const switchToOptionTwo = () =>
  {
    handleDropdownOpen();
    setSortingOptionThree(false);
    setSortingOptionOne(false);
    setSortingOptionTwo(true);
  }

  const switchToOptionThree = () =>
  {
    handleDropdownOpen();
    setSortingOptionTwo(false);
    setSortingOptionOne(false);
    setSortingOptionThree(true);
  }

  const handleDropdownOpen = () =>
  {
    if (dropdownOpen) {
      setDropdownOpen(false);
    } else {
      setDropdownOpen(true);
    }
  }

  useEffect(() =>
  {
    if (buttonType == "Job")
    {
      if (sortingOptionOne == true)
      {
        changeSortByJob(optionOne);
      } else if (sortingOptionTwo == true)
      {
        changeSortByJob(optionTwo);
      } else if (sortingOptionThree == true)
      {
        changeSortByJob(optionThree);
      }
    } else if (buttonType == "Date")
    {
      if (sortingOptionOne == true)
      {
        changeSortBy("hire-date");
      } else if (sortingOptionTwo == true)
      {
        changeSortBy("hire-date-reverse");
      }
    } else if (buttonType == "Name")
    {
      if (sortingOptionOne == true) {
        changeSortBy("name");
      } else if (sortingOptionTwo == true) {
        changeSortBy("name-reverse");
      }
    }
  }, [sortingOptionOne, sortingOptionTwo, sortingOptionThree])

  useEffect(() =>
  {
    if (selectingDropdownOptions == false && dropdownOpen == true)
    {
      handleDropdownOpen();
    }
  }, [selectingDropdownOptions])

  return (
    <div className={buttonType == "Job" ? "" : "mr-[0.5rem]"}>
      <div>
        <div>
                  
          <Button
            variant="outline"
            className="text-sm text-gray-600 w-[10rem] flex justify-between"
            onClick={handleDropdownOpen}
            onMouseEnter={() => setSelectingDropdownOptions(true)}
            onMouseLeave={() => setSelectingDropdownOptions(false)}
          >
            <p className="ml-[0.5rem]">{label}</p>
            <FaCaretUp className={`mr-[0.1rem] ${dropdownOpen ? "hidden" : ""}`} />
            <FaCaretDown className={`mr-[0.1rem] ${dropdownOpen ? "" : "hidden"}`} />
          </Button>

        </div>
        <div
          className={`z-50 border bg-white flex flex-col items-center w-[10rem] rounded-[5px] absolute text-center ${dropdownOpen ? "" : "hidden"}`}
          onMouseEnter={() => setSelectingDropdownOptions(true)}
          onMouseLeave={() => setSelectingDropdownOptions(false)}
        >

          <button
            className={`cursor-pointer pt-[5px] pb-[2.5px] border-b w-full rounded-t-[5px] ${hoveringOptionOne ? "bg-blue-100" : ""}`}
            onClick={switchToOptionOne}
            onMouseEnter={() => setHoveringOptionOne(true)}
            onMouseLeave={() => setHoveringOptionOne(false)}
          >
            {optionOne}
          </button>

          <button
            className={`cursor-pointer pt-[2.5px] pb-[2.5px] border-t border-b w-full ${hoveringOptionTwo ? "bg-blue-100" : ""} ${buttonType == "Job" ? "" : "rounded-b-[5px]"}`}
            onClick={switchToOptionTwo}
            onMouseEnter={() => setHoveringOptionTwo(true)}
            onMouseLeave={() => setHoveringOptionTwo(false)}
          >
            {optionTwo}
          </button>

          <div
            className={`cursor-pointer pt-[2.5px] pb-[5px] border-t w-full rounded-b-[5px] ${hoveringOptionThree ? "bg-blue-100" : ""} ${buttonType == "Job" ? "" : "hidden"}`}
            onClick={switchToOptionThree}
            onMouseEnter={() => setHoveringOptionThree(true)}
            onMouseLeave={() => setHoveringOptionThree(false)}
          >
            {optionThree}
          </div>

        </div>
      </div>
    </div>
  )
}

export default DropdownButton