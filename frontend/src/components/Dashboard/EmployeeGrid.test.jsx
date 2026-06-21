import { render, screen } from '@testing-library/react';
import EmployeeGrid from './EmployeeGrid';
import * as api from '../../services/api';
import { vi } from 'vitest';

// Completely mock the API service so we don't make real network requests
vi.mock('../../services/api');

describe('EmployeeGrid Component', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display a graceful empty state when the backend returns zero results', async () => {
    // Intercept the API call and return an empty array
    api.fetchEmployees.mockResolvedValue({
      success: true,
      data: [],
      meta: { total: 0, page: 1, totalPages: 0 }
    });

    render(<EmployeeGrid />);

    // screen.findByText automatically waits for async operations to finish
    expect(await screen.findByText(/No employees found matching those filters/i)).toBeInTheDocument();
  });

  it('should correctly format currency and render employee data into the DOM', async () => {
    // Intercept the API call and return one fake employee
    api.fetchEmployees.mockResolvedValue({
      success: true,
      data: [{ 
        id: 1, 
        first_name: 'Jane', 
        last_name: 'Doe', 
        job_title: 'Lead Architect', 
        department: 'Engineering', 
        country: 'Canada', 
        salary: 145000 
      }],
      meta: { total: 1, page: 1, totalPages: 1 }
    });

    render(<EmployeeGrid />);

    // Validate the raw text rendered
    expect(await screen.findByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Lead Architect')).toBeInTheDocument();
    
    // Validate that our Intl.NumberFormat localized the number correctly!
    expect(screen.getByText('$145,000.00')).toBeInTheDocument();
  });
});