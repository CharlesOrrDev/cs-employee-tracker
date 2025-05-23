'use client'

import { Employee } from '@/lib/interfaces/interfaces'
import React, { useEffect, useState, useCallback } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { cn } from '@/lib/utils'
import { Calendar } from './ui/calendar'
import { CalendarIcon } from 'lucide-react'
import { Label } from './ui/label'
import { FaCaretDown, FaCaretUp } from 'react-icons/fa'
import { updateEmployee } from '@/lib/services/employee-service'

const EmployeeEditView = ({ employee, edit, setEdit, refreshEmployees }: { employee: Employee, edit: boolean, setEdit: (value: boolean) => void, refreshEmployees: () => Promise<void> }) =>
{
  const [jobSelect, setJobSelect] = useState("");

  const [jobOpen, setJobOpen] = useState(false);
  const [selectingJobOptions, setSelectingJobOptions] = useState(false);

  const [hoveringCustomer, setHoveringCustomer] = useState(false);
  const [hoveringIT, setHoveringIT] = useState(false);
  const [hoveringSoftware, setHoveringSoftware] = useState(false);

  const [statusSelect, setStatusSelect] = useState("");

  const [statusOpen, setStatusOpen] = useState(false);
  const [selectingStatusOptions, setSelectingStatusOptions] = useState(false);

  const [hoveringActive, setHoveringActive] = useState(false);
  const [hoveringSick, setHoveringSick] = useState(false);
  const [hoveringOutOfOffice, setHoveringOutOfOffice] = useState(false);

  const [token, setToken] = useState('');

  const [employeeToChange, setEmployeeToChange] = useState<Employee>({
    id: 0,
    name: "",
    jobTitle: "",
    hireDate: "",
    details: "",
    status: "",
  });

  const handleEmployeeToChange = (e: React.ChangeEvent<HTMLInputElement>) =>
  {
    setEmployeeToChange({
      ...employeeToChange,
      [e.target.id]: e.target.value,
    });
    console.log(employeeToChange);
  };

  const handleEmployeeToChangeHireDate = (date: string) =>
  {
    setEmployeeToChange({
      ...employeeToChange,
      hireDate: date,
    });
  };

  const handleJobOpen = useCallback(() =>
  {
    setJobOpen(prev => !prev);
  }, []);

  const handleStatusOpen = useCallback(() =>
  {
    setStatusOpen(prev => !prev);
  }, []);

  const onOpenModal = useCallback(() =>
  {
    setEmployeeToChange(employee as Employee);
  }, [employee]);
  
  const onCloseModal = useCallback(() =>
  {
    setEmployeeToChange({ id: 0, name: "", jobTitle: "", hireDate: "", details: "", status: "" });
  }, []);

  const formatDateForInput = (date: string) =>
  {
    if (!date) return undefined;

    const [year, month, day] = date.toString().split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const formatDateFromInput = (date: Date | undefined) =>
  {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleEmployee = async () =>
  {
    try {
      const employeeWithChanges = {
        ...employeeToChange,
        name: employeeToChange.name.trim(),
        jobTitle: employeeToChange.jobTitle.trim(),
      };

      if (await updateEmployee(token, employeeWithChanges))
      {
        setEdit(false);
        await refreshEmployees();
      }
      
      setEmployeeToChange({
        id: 0,
        name: "",
        jobTitle: "",
        hireDate: "",
        details: "",
        status: "",
      });
    } catch (error) {
      console.log("error", error);
    }

    onCloseModal();
  };

  useEffect(() =>
  {
    if (edit == false)
    {
        onCloseModal();
    } else if (edit == true)
    {
        onOpenModal();
    }
  },[edit])

  useEffect(() =>
  {
    if (jobOpen)
    {
      handleJobOpen();
    }
  },[jobSelect])

  useEffect(() =>
  {
    if (selectingJobOptions == false && jobOpen == true)
    {
      handleJobOpen();
    }
  },[selectingJobOptions])
  
  useEffect(() =>
  {
    employeeToChange.jobTitle = jobSelect;
  },[jobSelect])

  useEffect(() =>
  {
    if (statusOpen)
    {
      handleStatusOpen();
    }
  },[statusSelect])

  useEffect(() =>
  {
    if (selectingStatusOptions == false && statusOpen == true)
    {
      handleStatusOpen();
    }
  },[selectingStatusOptions])
  
  useEffect(() =>
  {
    employeeToChange.status = statusSelect;
  },[statusSelect])

  useEffect(() =>
  {
    const handleToken = async () => {
      if (localStorage.getItem('user')) {
        setToken(await JSON.parse(localStorage.getItem('user')!).token);
      }
      if (sessionStorage.getItem('user')) {
        setToken(await JSON.parse(sessionStorage.getItem('user')!).token);
      }
    }
  
    handleToken();
  }, []);

  return (
    <>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="jobTitle">Job title</Label>
        </div>
        <Input
          id="jobTitle"
          className="hidden"
          value={employeeToChange.jobTitle}
          onChange={handleEmployeeToChange}
        />
        <div>
          <div>
                                              
            <Button
              variant="outline"
              className="text-sm text-gray-600 w-[14.075rem] flex justify-between"
              onClick={handleJobOpen}
              onMouseEnter={() => setSelectingJobOptions(true)}
              onMouseLeave={() => setSelectingJobOptions(false)}
            >
              <p className="ml-[0.5rem]">{employeeToChange.jobTitle}</p>
              <FaCaretUp className={`mr-[0.1rem] ${jobOpen ? "hidden" : ""}`} />
              <FaCaretDown className={`mr-[0.1rem] ${jobOpen ? "" : "hidden"}`} />
            </Button>
                            
          </div>
          <div
            className={`z-50 border bg-white flex flex-col items-center w-[14.075rem] rounded-[5px] absolute text-center ${jobOpen ? "" : "hidden"}`}
            onMouseEnter={() => setSelectingJobOptions(true)}
            onMouseLeave={() => setSelectingJobOptions(false)}
          >
                            
          <button
            className={`cursor-pointer pt-[5px] pb-[2.5px] border-b w-full rounded-t-[5px] ${hoveringCustomer ? "bg-blue-100" : ""}`}
            onClick={() => setJobSelect("Customer Support")}
            onMouseEnter={() => setHoveringCustomer(true)}
            onMouseLeave={() => setHoveringCustomer(false)}
          >
            Customer Support
          </button>
                            
          <button
            className={`cursor-pointer pt-[2.5px] pb-[2.5px] border-t border-b w-full ${hoveringIT ? "bg-blue-100" : ""}`}
            onClick={() => setJobSelect("IT Support Specialist")}
            onMouseEnter={() => setHoveringIT(true)}
            onMouseLeave={() => setHoveringIT(false)}
          >
            IT Support Specialist
          </button>
                            
          <div
            className={`cursor-pointer pt-[2.5px] pb-[5px] border-t w-full rounded-b-[5px] ${hoveringSoftware ? "bg-blue-100" : ""}`}
            onClick={() => setJobSelect("Software Engineer")}
            onMouseEnter={() => setHoveringSoftware(true)}
            onMouseLeave={() => setHoveringSoftware(false)}
          >
            Software Engineer
          </div>
                            
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold">Details</p>
        <Input onChange={handleEmployeeToChange} value={employeeToChange.details || ""} />
      </div>

      <div>
        <div>
          <p className="text-sm font-semibold">Status</p>
        </div>
        <Input
          className="hidden"
          value={employeeToChange.status || ""}
          onChange={handleEmployeeToChange}
        />
        <div>
          <div>
                                              
            <Button
              variant="outline"
              className="text-sm text-gray-600 w-[14.075rem] flex justify-between"
              onClick={handleStatusOpen}
              onMouseEnter={() => setSelectingStatusOptions(true)}
              onMouseLeave={() => setSelectingStatusOptions(false)}
            >
              <p className="ml-[0.5rem]">{employeeToChange.status}</p>
              <FaCaretUp className={`mr-[0.1rem] ${statusOpen ? "hidden" : ""}`} />
              <FaCaretDown className={`mr-[0.1rem] ${statusOpen ? "" : "hidden"}`} />
            </Button>
                            
          </div>
          <div
            className={`z-50 border bg-white flex flex-col items-center w-[14.075rem] rounded-[5px] absolute text-center ${statusOpen ? "" : "hidden"}`}
            onMouseEnter={() => setSelectingStatusOptions(true)}
            onMouseLeave={() => setSelectingStatusOptions(false)}
          >
                            
          <button
            className={`cursor-pointer pt-[5px] pb-[2.5px] border-b w-full rounded-t-[5px] ${hoveringActive ? "bg-blue-100" : ""}`}
            onClick={() => setStatusSelect("Active")}
            onMouseEnter={() => setHoveringActive(true)}
            onMouseLeave={() => setHoveringActive(false)}
          >
            Active
          </button>
                            
          <button
            className={`cursor-pointer pt-[2.5px] pb-[2.5px] border-t border-b w-full ${hoveringSick ? "bg-blue-100" : ""}`}
            onClick={() => setStatusSelect("Sick")}
            onMouseEnter={() => setHoveringSick(true)}
            onMouseLeave={() => setHoveringSick(false)}
          >
            Sick
          </button>
                            
          <div
            className={`cursor-pointer pt-[2.5px] pb-[5px] border-t w-full rounded-b-[5px] ${hoveringOutOfOffice ? "bg-blue-100" : ""}`}
            onClick={() => setStatusSelect("Out of Office")}
            onMouseEnter={() => setHoveringOutOfOffice(true)}
            onMouseLeave={() => setHoveringOutOfOffice(false)}
          >
            Out of Office
          </div>
                            
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold">Hire Date</p>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !employeeToChange.hireDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon />
              {employeeToChange.hireDate ? employeeToChange.hireDate : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formatDateForInput(employeeToChange.hireDate)}
              onSelect={(e) =>
                handleEmployeeToChangeHireDate(formatDateFromInput(e))
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>


      <div className="flex justify-between pt-4">
        <Button onClick={() => setEdit(false)}>Cancel</Button>
        {employee && <Button onClick={handleEmployee} variant="outline">Save Edits</Button>}
      </div>
    </>
  )
}

export default EmployeeEditView