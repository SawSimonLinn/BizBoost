# BizBoost MVP Frontend Features

This document outlines the core frontend features implemented in the BizBoost application. The application is designed to provide franchisees with a comprehensive dashboard to manage their business performance, finances, and growth strategies.

## Core Application Structure
- **Next.js App Router**: The application uses the latest Next.js features for optimized routing and performance.
- **Responsive Sidebar Navigation**: A collapsible sidebar provides easy access to all sections of the application on both desktop and mobile.
- **Consistent UI/UX**: All pages share a consistent header and layout for a predictable user experience.

## Feature Breakdown

### 1. Dashboard (`/dashboard`)
This is the main hub of the application, providing an at-a-glance overview of the franchise's financial health.
- **Key Performance Indicators (KPIs)**: Displays critical metrics:
  - Total Revenue
  - Franchise Fees
  - Operating Costs
  - Net Take-Home Pay
- **Data Input & Fee Configuration**: An interactive card allowing users to:
  - Input total monthly sales, with an option to break it down by week.
  - Enter inventory costs for the period.
  - Configure the royalty fee percentage.
  - Add and manage a list of other miscellaneous franchisee fees (e.g., tech fee, marketing fee).
- **Revenue Split Visualization**: A clear, visual breakdown showing the portion of revenue that goes to business expenses versus the owner's take-home pay.
- **Fee & Cost Breakdown Chart**: A pie chart that visualizes the proportion of major expenses, including royalty fees, staff costs, inventory, and other fees.
- **Take-Home Tier Indicator**: A progress bar that shows how the current net take-home pay ranks against predefined "Low," "Good," and "Best" tiers.
- **Staff Cost Management**: A tool to add, edit, and remove staff members, calculate total labor costs based on hourly wages or monthly salaries, and see the impact on profitability.

### 2. Personal Finances (`/personal-finances`)
A dedicated page to help the franchisee manage their personal budget after business expenses.
- **Take-Home Calculator**:
  - Starts with the net earnings calculated from the dashboard.
  - Allows users to list and manage their personal monthly expenses (e.g., rent, groceries, loans).
  - Calculates the final amount remaining for savings.
  - Includes a savings goal planner to estimate how many months it will take to reach a savings target.

### 3. Performance Analytics (`/performance`)
This page offers a deeper dive into the business's financial performance metrics.
- **Detailed KPIs**: Tracks more advanced metrics like:
  - Gross Profit & Net Profit
  - Gross Margin & Net Margin
  - Staff Cost as a percentage of revenue
  - Sales per Employee
- **Sales & Profit Trend Chart**: A line chart that visualizes the trend of Sales, Gross Profit, and Net Profit over historical periods, making it easy to spot patterns.

### 4. AI-Powered Insights (`/ai-insights`)
This section leverages generative AI to provide actionable advice.
- **Target Sales Goal Setting**: Suggests a target monthly sales figure needed to achieve a user-specified take-home pay goal.
- **Cost-Saving Analysis**: Identifies potential areas to reduce costs based on the provided financial data.
- **Focus Area Suggestions**: Analyzes historical performance data to recommend which areas of the business to focus on for growth.

### 5. Settings (`/settings`)
A placeholder page for future application-level settings and configurations.