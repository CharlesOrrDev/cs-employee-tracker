'use client'

import { Employee } from '@/lib/interfaces/interfaces';
import { deleteEmployee, getEmployees } from '@/lib/services/employee-service';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { Button } from './ui/button';
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from './ui/table';
import EmployeeModal from './EmployeeModal';

const EmployeeTable = () =>
{
  const { push } = useRouter();

  // useStates
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [sortedEmployees, setSortedEmployees] = useState<Employee[]>([]);

  const [token, setToken] = useState('');

  const [sortBy, setSortBy] = useState("");
  const [sortByJob, setSortByJob] = useState("");

  const [sortingAZ, setSortingAZ] = useState<boolean>();
  const [sortingZA, setSortingZA] = useState<boolean>();

  const [nameOpen, setNameOpen] = useState(false);
  const [selectingNameOptions, setSelectingNameOptions] = useState(false);

  const [sortingNewest, setSortingNewest] = useState<boolean>();
  const [sortingOldest, setSortingOldest] = useState<boolean>();

  const [hireOpen, setHireOpen] = useState(false);
  const [selectingHireOptions, setSelectingHireOptions] = useState(false);

  const [sortingCustomer, setSortingCustomer] = useState<boolean>();
  const [sortingIT, setSortingIT] = useState<boolean>();
  const [sortingSoftware, setSortingSoftware] = useState<boolean>();

  const [jobOpen, setJobOpen] = useState(false);
  const [selectingJobOptions, setSelectingJobOptions] = useState(false);

  const switchToAZ = () =>
  {
    handleNameOpen();
    setSortingZA(false);
    setSortingAZ(true);
  }

  const switchToZA = () =>
  {
    handleNameOpen();
    setSortingAZ(false);
    setSortingZA(true);
  }

  const switchToNewest = () =>
  {
    handleHireOpen();
    setSortingOldest(false);
    setSortingNewest(true);
  }

  const switchToOldest = () =>
  {
    handleHireOpen();
    setSortingNewest(false);
    setSortingOldest(true);
  }

  const switchToCustomer = () =>
  {
    handleJobOpen();
    setSortingSoftware(false);
    setSortingIT(false);
    setSortingCustomer(true);
  }

  const switchToIT = () =>
  {
    handleJobOpen();
    setSortingSoftware(false);
    setSortingCustomer(false);
    setSortingIT(true);
  }

  const switchToSoftware = () =>
  {
    handleJobOpen();
    setSortingIT(false);
    setSortingCustomer(false);
    setSortingSoftware(true);
  }

  const handleNameOpen = () =>
  {
    if (nameOpen)
    {
      setNameOpen(false);
    }else
    {
      setNameOpen(true);
    }
  }

  const handleHireOpen = () =>
  {
    if (hireOpen)
    {
      setHireOpen(false);
    }else
    {
      setHireOpen(true);
    }
  }

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

  // Function to get employees
  const handleGetEmployees = useCallback(async () =>
  {
    try {
      const result: Employee[] | "Not Authorized" = await getEmployees(token);
      // const result: Employee[] | "Not Authorized" = [];
      if (result.toString() === "Not Authorized") {
        localStorage.setItem("Not Authorized", 'true');
        push("/login");
      }

      setEmployees(result as Employee[]);
    } catch (error) {
      console.log("error", error);
    }
  }, [token, push]);

  // Updating sort functions
  const changeSortBy = (value: string) =>
  {
    if (value == "name" && sortBy == "name") {
      setSortBy(`${value}-reverse`);
    } else if (value == "hire-date" && sortBy == "hire-date") {
      setSortBy(`${value}-reverse`);
    } else {
      setSortBy(value);
    }

    if (sortByJob) {
      setSortByJob("");
    }
  };

  const changeSortByJob = (value: string) =>
  {
    setSortBy("job-title");

    setSortByJob(value);
  };

  // Delete employee
  const handleDeleteEmployee = async (id: number) =>
  {
    try {
      if (await deleteEmployee(token, id)) {
        await handleGetEmployees();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  // Getting the user token from storage
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

  // Fetching employees after token is set
  useEffect(() =>
  {
    if (token !== '') {
      handleGetEmployees();
    }
  }, [token, handleGetEmployees])

  useEffect(() =>
  {
    if (sortingAZ == true)
    {
      changeSortBy("name");
    }else if (sortingZA == true)
    {
      changeSortBy("name-reverse");
    }
  },[sortingAZ, sortingZA])

  useEffect(() =>
  {
    if (sortingNewest == true)
    {
      changeSortBy("hire-date");
    }else if (sortingOldest == true)
    {
      changeSortBy("hire-date-reverse");
    }
  },[sortingSoftware, sortingOldest])

  useEffect(() =>
  {
    if (sortingCustomer == true)
    {
      changeSortByJob("Customer Support");
    }else if (sortingIT == true)
    {
      changeSortByJob("IT Support Specialist");
    }else if (sortingSoftware == true)
    {
      changeSortByJob("Software Engineer");
    }
  },[sortingCustomer, sortingIT, sortingSoftware])

  // Sorting the employees
  useEffect(() =>
  {
    let sortingEmployees = [...employees];

    const handleSorting = () =>
    {
      switch (sortBy) {
        case "name":
          sortingEmployees.sort((a: Employee, b: Employee) => a.name.localeCompare(b.name));
          break;
        case "name-reverse":
          sortingEmployees.sort((a: Employee, b: Employee) => b.name.localeCompare(a.name));
          break;
        case "hire-date":
          sortingEmployees.sort(
            (a: Employee, b: Employee) => Number(new Date(b.hireDate)) - Number(new Date(a.hireDate))
          );
          break;
        case "hire-date-reverse":
          sortingEmployees.sort(
            (a: Employee, b: Employee) => Number(new Date(a.hireDate)) - Number(new Date(b.hireDate))
          );
          break;
        case "job-title":
          sortingEmployees = sortingEmployees.filter((employee: Employee) => employee.jobTitle === sortByJob);
          break;
        default:
          sortingEmployees.sort((a: Employee, b: Employee) => a.id - b.id);
          break;
      }
      setSortedEmployees(sortingEmployees);
    };

    handleSorting();

  }, [employees, sortBy, sortByJob]);

  useEffect(() =>
  {
    if (selectingNameOptions == false && nameOpen == true)
    {
      handleNameOpen();
    }
  },[selectingNameOptions])

  useEffect(() =>
  {
    if (selectingHireOptions == false && hireOpen == true)
    {
      handleHireOpen();
    }
  },[selectingHireOptions])

  useEffect(() =>
  {
    if (selectingJobOptions == false && jobOpen == true)
    {
      handleJobOpen();
    }
  },[selectingJobOptions])

  return (
    <>
      {/* Sort by - Start */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 p-4">
        <div className="flex items-center gap-3 mb-2 md:mb-0">
          <h2 className="text-2xl font-medium text-gray-700 dark:text-white">Add new hire</h2>
          <EmployeeModal type="Add" employee={null} refreshEmployees={handleGetEmployees} />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center">
            <p className="mr-2 text-sm text-gray-600">Sort by:</p>
            
            <div className="mr-[0.5rem]">
              <div>
                <div>

                  <Button
                    variant="outline"
                    className="text-sm text-gray-600 w-[10rem] flex justify-between"
                    onClick={handleNameOpen}
                    onMouseEnter={() => setSelectingNameOptions(true)}
                    onMouseLeave={() => setSelectingNameOptions(false)}
                  >
                    <p className="ml-[0.5rem]">Name</p>
                    <FaCaretUp className={`mr-[0.1rem] ${nameOpen ? "hidden" : ""}`} />
                    <FaCaretDown className={`mr-[0.1rem] ${nameOpen ? "" : "hidden"}`} />
                  </Button>

                </div>
                <div
                  className={`z-50 border bg-white flex flex-col items-center w-[10rem] rounded-[5px] absolute ${nameOpen ? "" : "hidden"}`}
                  onMouseEnter={() => setSelectingNameOptions(true)}
                  onMouseLeave={() => setSelectingNameOptions(false)}
                >

                  <button
                    className="cursor-pointer mt-[5px] mb-[2.5px]"
                    onClick={switchToAZ}
                  >
                    A-Z
                  </button>

                  <button
                  className="cursor-pointer mt-[2.5px] mb-[5px]"
                    onClick={switchToZA}
                  >
                    Z-A
                  </button>

                </div>
              </div>
            </div>

            <div className="mr-[0.5rem]">
              <div>
                <div>
                  
                  <Button
                    variant="outline"
                    className="text-sm text-gray-600 w-[10rem] flex justify-between"
                    onClick={handleHireOpen}
                    onMouseEnter={() => setSelectingHireOptions(true)}
                    onMouseLeave={() => setSelectingHireOptions(false)}
                  >
                    <p className="ml-[0.5rem]">Hire date</p>
                    <FaCaretUp className={`mr-[0.1rem] ${hireOpen ? "hidden" : ""}`} />
                    <FaCaretDown className={`mr-[0.1rem] ${hireOpen ? "" : "hidden"}`} />
                  </Button>

                </div>
                <div
                  className={`z-50 border bg-white flex flex-col items-center w-[10rem] rounded-[5px] absolute ${hireOpen ? "" : "hidden"}`}
                  onMouseEnter={() => setSelectingHireOptions(true)}
                  onMouseLeave={() => setSelectingHireOptions(false)}
                >

                  <button
                    className="cursor-pointer mt-[5px] mb-[2.5px]"
                    onClick={switchToNewest}
                  >
                    Newest First
                  </button>

                  <button
                    className="cursor-pointer mt-[2.5px] mb-[5px]"
                    onClick={switchToOldest}
                  >
                    Oldest First
                  </button>

                </div>
              </div>
            </div>

            <div>
              <div>
                <div>
                  
                  <Button
                    variant="outline"
                    className="text-sm text-gray-600 w-[10rem] flex justify-between"
                    onClick={handleJobOpen}
                    onMouseEnter={() => setSelectingJobOptions(true)}
                    onMouseLeave={() => setSelectingJobOptions(false)}
                  >
                    <p className="ml-[0.5rem]">Job Title</p>
                    <FaCaretUp className={`mr-[0.1rem] ${jobOpen ? "hidden" : ""}`} />
                    <FaCaretDown className={`mr-[0.1rem] ${jobOpen ? "" : "hidden"}`} />
                  </Button>

                </div>
                <div
                  className={`z-50 border bg-white flex flex-col items-center w-[10rem] rounded-[5px] absolute ${jobOpen ? "" : "hidden"}`}
                  onMouseEnter={() => setSelectingJobOptions(true)}
                  onMouseLeave={() => setSelectingJobOptions(false)}
                >

                  <button
                    className="cursor-pointer mt-[5px] mb-[2.5px]"
                    onClick={switchToCustomer}
                  >
                    Customer Support
                  </button>

                  <button
                    className="cursor-pointer mt-[2.5px] mb-[2.5px]"
                    onClick={switchToIT}
                  >
                    IT Support Specialist
                  </button>

                  <div
                    className="cursor-pointer mt-[2.5px] mb-[5px]"
                    onClick={switchToSoftware}
                  >
                    Software Engineer
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Sort by - End */}

      {/* Display table - Start */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='text-lg'>Employee name</TableHead>
            <TableHead className='text-lg'>Job Title</TableHead>
            <TableHead className='text-lg'>Date Hired</TableHead>
            <TableHead className="text-lg text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedEmployees.length === 0 ? (
            <TableRow>
              <TableCell></TableCell>
              <TableCell className="text-center">
                No Employees
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          ) : (
            sortedEmployees.map((employee, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{employee.name}</TableCell>
                <TableCell>{employee.jobTitle}</TableCell>
                <TableCell>{employee.hireDate}</TableCell>
                <TableCell className="flex gap-3 justify-end">
                  <EmployeeModal type="Edit" employee={employee} refreshEmployees={handleGetEmployees} />
                  <Button variant="destructive" onClick={() => handleDeleteEmployee(employee.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {/* Display table - End */}
    </>
  )
}

export default EmployeeTable