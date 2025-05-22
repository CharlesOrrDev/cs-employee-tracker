'use client'

import { Employee } from '@/lib/interfaces/interfaces';
import { deleteEmployee, getEmployees } from '@/lib/services/employee-service';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState, Suspense } from 'react'
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { Button } from './ui/button';
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from './ui/table';
import EmployeeModal from './EmployeeModal';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const EmployeeTableContent = () => {
  const router = useRouter();

  const { push } = useRouter();
  const searchParams = useSearchParams();

  // useStates
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [sortedEmployees, setSortedEmployees] = useState<Employee[]>([]);

  const [token, setToken] = useState('');

  const [sortBy, setSortBy] = useState("");
  const [sortByJob, setSortByJob] = useState("");

  const [sortingAZ, setSortingAZ] = useState<boolean>();
  const [sortingZA, setSortingZA] = useState<boolean>();

  const [hoveringAZ, setHoveringAZ] = useState(false);
  const [hoveringZA, setHoveringZA] = useState(false);

  const [nameOpen, setNameOpen] = useState(false);
  const [selectingNameOptions, setSelectingNameOptions] = useState(false);

  const [sortingNewest, setSortingNewest] = useState<boolean>();
  const [sortingOldest, setSortingOldest] = useState<boolean>();

  const [hoveringNewest, setHoveringNewest] = useState(false);
  const [hoveringOldest, setHoveringOldest] = useState(false);

  const [hireOpen, setHireOpen] = useState(false);
  const [selectingHireOptions, setSelectingHireOptions] = useState(false);

  const [sortingCustomer, setSortingCustomer] = useState<boolean>();
  const [sortingIT, setSortingIT] = useState<boolean>();
  const [sortingSoftware, setSortingSoftware] = useState<boolean>();

  const [hoveringCustomer, setHoveringCustomer] = useState(false);
  const [hoveringIT, setHoveringIT] = useState(false);
  const [hoveringSoftware, setHoveringSoftware] = useState(false);

  const [jobOpen, setJobOpen] = useState(false);
  const [selectingJobOptions, setSelectingJobOptions] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [paginatedEmployees, setPaginatedEmployees] = useState<Employee[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const switchToAZ = () => {
    handleNameOpen();
    setSortingZA(false);
    setSortingAZ(true);
  }

  const switchToZA = () => {
    handleNameOpen();
    setSortingAZ(false);
    setSortingZA(true);
  }

  const switchToNewest = () => {
    handleHireOpen();
    setSortingOldest(false);
    setSortingNewest(true);
  }

  const switchToOldest = () => {
    handleHireOpen();
    setSortingNewest(false);
    setSortingOldest(true);
  }

  const switchToCustomer = () => {
    handleJobOpen();
    setSortingSoftware(false);
    setSortingIT(false);
    setSortingCustomer(true);
  }

  const switchToIT = () => {
    handleJobOpen();
    setSortingSoftware(false);
    setSortingCustomer(false);
    setSortingIT(true);
  }

  const switchToSoftware = () => {
    handleJobOpen();
    setSortingIT(false);
    setSortingCustomer(false);
    setSortingSoftware(true);
  }

  const handleNameOpen = () => {
    if (nameOpen) {
      setNameOpen(false);
    } else {
      setNameOpen(true);
    }
  }

  const handleHireOpen = () => {
    if (hireOpen) {
      setHireOpen(false);
    } else {
      setHireOpen(true);
    }
  }

  const handleJobOpen = () => {
    if (jobOpen) {
      setJobOpen(false);
    } else {
      setJobOpen(true);
    }
  }

  // Function to get employees
  const handleGetEmployees = useCallback(async () => {
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
  const changeSortBy = (value: string) => {
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

  const changeSortByJob = (value: string) => {
    setSortBy("job-title");

    setSortByJob(value);
  };

  // Delete employee
  const handleDeleteEmployee = async (id: number) => {
    try {
      if (await deleteEmployee(token, id)) {
        await handleGetEmployees();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const updateURLParams = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", currentPage.toString());
    url.searchParams.set("items", itemsPerPage.toString());
    window.history.replaceState({}, "", url.toString());
  }
  
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <PaginationItem key={i}>
            <PaginationLink href="#" onClick={() => handlePageChange(i)} isActive={i === currentPage}>
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }
    } else {
      if (currentPage > 2) {
        pageNumbers.push(
          <PaginationItem key={1}>
            <PaginationLink href="#" onClick={() => handlePageChange(1)}>
              1
            </PaginationLink>
          </PaginationItem>
        )
      }

      if (currentPage > 3) {
        pageNumbers.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis/>
          </PaginationItem>
        )
      }

      let start = Math.max(currentPage - 1, 1);
      let end = Math.min(currentPage + 1, totalPages);

      if (currentPage <= 2) {
        end = Math.min(3, totalPages);
      } else if (currentPage >= totalPages - 1) {
        start = Math.max(totalPages - 2, 1);
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(
          <PaginationItem key={i}>
            <PaginationLink href="#" onClick={() => handlePageChange(i)} isActive={i === currentPage}>
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }

      if (currentPage < totalPages - 2) {
        pageNumbers.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis/>
          </PaginationItem>
        )
      }

      if (currentPage < totalPages - 1) {
        pageNumbers.push(
          <PaginationItem key={totalPages}>
            <PaginationLink href="#" onClick={() => handlePageChange(totalPages)}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )
      }
    }

    return pageNumbers;
  }

  // Getting the user token from storage
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

  // Fetching employees after token is set
  useEffect(() => {
    if (token !== '') {
      handleGetEmployees();
    }
  }, [token, handleGetEmployees])

  useEffect(() => {
    if (sortingAZ == true) {
      changeSortBy("name");
    } else if (sortingZA == true) {
      changeSortBy("name-reverse");
    }
  }, [sortingAZ, sortingZA])

  useEffect(() => {
    if (sortingNewest == true) {
      changeSortBy("hire-date");
    } else if (sortingOldest == true) {
      changeSortBy("hire-date-reverse");
    }
  }, [sortingNewest, sortingOldest])

  useEffect(() => {
    if (sortingCustomer == true) {
      changeSortByJob("Customer Support");
    } else if (sortingIT == true) {
      changeSortByJob("IT Support Specialist");
    } else if (sortingSoftware == true) {
      changeSortByJob("Software Engineer");
    }
  }, [sortingCustomer, sortingIT, sortingSoftware])

  // Sorting the employees
  useEffect(() => {
    let sortingEmployees = [...employees];
    
    const handleSorting = () => {
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

  useEffect(() => {
    const calculatedTotalPages = Math.ceil(sortedEmployees.length / itemsPerPage);
    setTotalPages(calculatedTotalPages);

    if (currentPage > calculatedTotalPages) {
      setCurrentPage(calculatedTotalPages || 1);
    }

    const indexOfLastEmployee = currentPage * itemsPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
    const currentEmployees = sortedEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

    setPaginatedEmployees(currentEmployees);

    updateURLParams();
  }, [sortedEmployees, currentPage, itemsPerPage])

  useEffect(() => {
    const page = searchParams.get("page");
    const items = searchParams.get("items");

    if (page) {
      setCurrentPage(parseInt(page));
    }

    if (items) {
      setItemsPerPage(parseInt(items));
    }
  }, [searchParams])

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  }

  useEffect(() => {
    if (selectingNameOptions == false && nameOpen == true) {
      handleNameOpen();
    }
  }, [selectingNameOptions])

  useEffect(() => {
    if (selectingHireOptions == false && hireOpen == true) {
      handleHireOpen();
    }
  }, [selectingHireOptions])

  useEffect(() => {
    if (selectingJobOptions == false && jobOpen == true) {
      handleJobOpen();
    }
  }, [selectingJobOptions])

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
                    className={`cursor-pointer pt-[5px] pb-[2.5px] border-b w-full rounded-t-[5px] ${hoveringAZ ? "bg-blue-100" : ""}`}
                    onClick={switchToAZ}
                    onMouseEnter={() => setHoveringAZ(true)}
                    onMouseLeave={() => setHoveringAZ(false)}
                  >
                    A-Z
                  </button>

                  <button
                  className={`cursor-pointer pt-[2.5px] pb-[5px] border-t w-full rounded-b-[5px] ${hoveringZA ? "bg-blue-100" : ""}`}
                    onClick={switchToZA}
                    onMouseEnter={() => setHoveringZA(true)}
                    onMouseLeave={() => setHoveringZA(false)}
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
                    className={`cursor-pointer pt-[5px] pb-[2.5px] border-b w-full rounded-t-[5px] ${hoveringNewest ? "bg-blue-100" : ""}`}
                    onClick={switchToNewest}
                    onMouseEnter={() => setHoveringNewest(true)}
                    onMouseLeave={() => setHoveringNewest(false)}
                  >
                    Newest First
                  </button>

                  <button
                    className={`cursor-pointer pt-[2.5px] pb-[5px] border-t w-full rounded-b-[5px] ${hoveringOldest ? "bg-blue-100" : ""}`}
                    onClick={switchToOldest}
                    onMouseEnter={() => setHoveringOldest(true)}
                    onMouseLeave={() => setHoveringOldest(false)}
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
                  className={`z-50 border bg-white flex flex-col items-center w-[10rem] rounded-[5px] absolute text-center ${jobOpen ? "" : "hidden"}`}
                  onMouseEnter={() => setSelectingJobOptions(true)}
                  onMouseLeave={() => setSelectingJobOptions(false)}
                >

                  <button
                    className={`cursor-pointer pt-[5px] pb-[2.5px] border-b w-full rounded-t-[5px] ${hoveringCustomer ? "bg-blue-100" : ""}`}
                    onClick={switchToCustomer}
                    onMouseEnter={() => setHoveringCustomer(true)}
                    onMouseLeave={() => setHoveringCustomer(false)}
                  >
                    Customer Support
                  </button>

                  <button
                    className={`cursor-pointer pt-[2.5px] pb-[2.5px] border-t border-b w-full ${hoveringIT ? "bg-blue-100" : ""}`}
                    onClick={switchToIT}
                    onMouseEnter={() => setHoveringIT(true)}
                    onMouseLeave={() => setHoveringIT(false)}
                  >
                    IT Support Specialist
                  </button>

                  <div
                    className={`cursor-pointer pt-[2.5px] pb-[5px] border-t w-full rounded-b-[5px] ${hoveringSoftware ? "bg-blue-100" : ""}`}
                    onClick={switchToSoftware}
                    onMouseEnter={() => setHoveringSoftware(true)}
                    onMouseLeave={() => setHoveringSoftware(false)}
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
          {paginatedEmployees.length === 0 ? (
            <TableRow>
              <TableCell></TableCell>
              <TableCell className="text-center">
                No Employees
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          ) : (
            paginatedEmployees.map((employee, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{employee.name}</TableCell>
                <TableCell>{employee.jobTitle}</TableCell>
                <TableCell>{employee.hireDate}</TableCell>
                <TableCell className="flex justify-end">
                  <Button className="w-[73px] rounded-r-none border border-gray-400 bg-green-700 hover:bg-green-700/70" onClick={() => router.push(`/employee-page/${employee.id}`)}>
                    View
                  </Button>
                  <EmployeeModal type="Edit" employee={employee} refreshEmployees={handleGetEmployees} />
                  <Button className="rounded-l-none border border-gray-400" variant="destructive" onClick={() => handleDeleteEmployee(employee.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {/* Display table - End */}

      {sortedEmployees.length > 0 && (
       <div className="mt-4">
        <div className="mb-4 grid">

          <div className="mb-4 md:mb-0 flex items-center row-start-1 col-start-1 w-full">
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-600">Items per page:</span>
              <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="8"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8">8</SelectItem>
                  <SelectItem value="16">16</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                  <SelectItem value="40">40</SelectItem>
                  <SelectItem value="56">56</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-[68%]">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" onClick={(event) =>
                      {
                        event.preventDefault();
                        if (currentPage > 1) handlePageChange(currentPage - 1);
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {renderPageNumbers()}

                  <PaginationItem>
                    <PaginationNext href="#" onClick={(event) =>
                      {
                        event.preventDefault();
                        if (currentPage < totalPages) handlePageChange(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>

        <div className="mt-2 text-center text-sm text-gray-500">
          Showing {paginatedEmployees.length} of {sortedEmployees.length} employees
        </div>
       </div> 
      )}
    </>
  )
}

const EmployeeTableLoading = () => (
  <div className="flex items-center justify-center p-8">
    <div className="text-gray-500">Loading employees...</div>
  </div>
);

const EmployeeTable = () => {
  return (
    <Suspense fallback={<EmployeeTableLoading />}>
      <EmployeeTableContent />
    </Suspense>
  )
}

export default EmployeeTable