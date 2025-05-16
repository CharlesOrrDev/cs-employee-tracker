'use client'

import { Employee } from '@/lib/interfaces/interfaces'
import { addEmployee, updateEmployee } from '@/lib/services/employee-service';
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';
import { FaCaretDown, FaCaretUp, FaPlus } from 'react-icons/fa';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';


// Valid values for type: "Add" & "Edit"
const EmployeeModal = ({ type, employee, refreshEmployees }: { type: 'Add' | 'Edit', employee: Employee | null, refreshEmployees: () => Promise<void> }) =>
{
    const [jobOpen, setJobOpen] = useState(false);
    const [selectingJobOptions, setSelectingJobOptions] = useState(false);

    const [hoveringCustomer, setHoveringCustomer] = useState(false);
    const [hoveringIT, setHoveringIT] = useState(false);
    const [hoveringSoftware, setHoveringSoftware] = useState(false);

    const [jobSelect, setJobSelect] = useState("");

    const handleJobOpen = () =>
    {
        if (jobOpen)
        {
            setJobOpen(false);
        }else
        {
            setJobOpen(true);
        }
    }

    useEffect(() =>
    {
        if (selectingJobOptions == false && jobOpen == true)
        {
            handleJobOpen();
        }
    },[selectingJobOptions])

    // useStates
    const [openModal, setOpenModal] = useState(false);
    const [employeeToChange, setEmployeeToChange] = useState<Employee>({
        id: 0,
        name: "",
        jobTitle: "",
        hireDate: "",
    });

    const [token, setToken] = useState('');

    const disableBtn =
        employeeToChange.name.trim() == "" ||
        employeeToChange.jobTitle.trim() == "" ||
        employeeToChange.hireDate == "";

    // Modal Functions
    const onOpenModal = () => {
        if (type === "Edit") {
            setEmployeeToChange(employee as Employee);
        }

        setOpenModal(true);
    };

    const onCloseModal = () => {
        setOpenModal(false);
        setEmployeeToChange({ id: 0, name: "", jobTitle: "", hireDate: "" });
    };

    // Change employee functions
    const handleEmployeeToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmployeeToChange({
            ...employeeToChange,
            [e.target.id]: e.target.value,
        });
        console.log(employeeToChange);
    };

    const handleEmployeeToChangeHireDate = (date: string) => {
        setEmployeeToChange({
            ...employeeToChange,
            hireDate: date,
        });
    };

    // Date functions
    const formatDateForInput = (date: string) => {
        if (!date) return undefined;

        const [year, month, day] = date.toString().split("-").map(Number);
        return new Date(year, month - 1, day);
    };

    const formatDateFromInput = (date: Date | undefined) => {
        if (!date) return "";
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    // Add & Edit function
    const handleEmployee = async () => {
        try {
            const employeeWithChanges = {
                ...employeeToChange,
                name: employeeToChange.name.trim(),
                jobTitle: employeeToChange.jobTitle.trim(),
            };

            if (type === "Add") {
                if (await addEmployee(token, employeeWithChanges)) {
                    await refreshEmployees();
                }
            } else {
                if (await updateEmployee(token, employeeWithChanges)) {
                    await refreshEmployees();
                }
            }

            setEmployeeToChange({
                id: 0,
                name: "",
                jobTitle: "",
                hireDate: "",
            });
        } catch (error) {
            console.log("error", error);
        }

        onCloseModal();
    };

    useEffect(() => {
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

    useEffect(() =>
    {
        if (jobOpen)
        {
            handleJobOpen();
        }
    },[jobSelect])

    useEffect(() =>
    {
        employeeToChange.jobTitle = jobSelect;
    },[jobSelect])

    return (
        <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogTrigger asChild>
                {/* <Button variant="outline">Edit Profile</Button> */}
                <Button
                    color="success"
                    className={type === "Add" ? "flex items-center gap-1" : ""}
                    onClick={onOpenModal}
                >
                    {type === "Add" ? <FaPlus/> : <p className="w-[41px]">Edit</p>}
                </Button>
            </DialogTrigger>
            <DialogContent className='w-[40rem]'>
                <DialogHeader className='pb-3'>
                    <DialogTitle>
                        {type === "Add"
                            ? "Add New Employee"
                            : "Update Employee Information"}
                    </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-3 min-h-[30rem]">
                    <div>
                        <div className='pb-5'>
                            <div className="mb-2 block">
                                <Label htmlFor="name">Employee name</Label>
                            </div>
                            <Input
                                id="name"
                                value={employeeToChange.name}
                                onChange={handleEmployeeToChange}
                            />
                        </div>
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
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label>Date hired</Label>
                        </div>
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
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button
                            onClick={handleEmployee}
                            color="success"
                            disabled={disableBtn}
                        >
                            {type === "Add" ? "Add" : "Update"} Employee
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EmployeeModal