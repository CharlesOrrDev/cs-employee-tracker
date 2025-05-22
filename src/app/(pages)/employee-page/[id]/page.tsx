'use client'

import EmployeeEditView from '@/components/EmployeeEditView';
import EmployeeView from '@/components/EmployeeView';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Employee } from '@/lib/interfaces/interfaces';
import { getEmployeeById, getEmployees } from '@/lib/services/employee-service';
import { useParams, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'

const page = () =>
{
  const { push } = useRouter();

  const params = useParams();
  const employeeId = Number(params.id);

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [token, setToken] = useState('');

  const [isEditing, setIsEditing] = useState(false);

  const [employees, setEmployees] = useState<Employee[]>([]);

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

  useEffect(() =>
  {
    const getEmployee = async () => {
      if (token != '')
      {
        const tempEmployee = await getEmployeeById(token, employeeId);
        if (tempEmployee)
        {
          setEmployee(tempEmployee);
        }
      }
    }

    if (employeeId != 0) {
      getEmployee();
    }
  }, [token, employeeId])

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

  return (
    <div className="min-h-screen flex flex-col justify-center max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-black">
            {employee ? employee.name : 'No employee found'}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-black">
          {
            employee && (
              isEditing ?
              <EmployeeEditView employee={employee} edit={isEditing} setEdit={setIsEditing} refreshEmployees={handleGetEmployees} />
              :
              <EmployeeView employee={employee} setEdit={setIsEditing} />
            )
          }
        </CardContent>
      </Card>
    </div>
  )
}

export default page