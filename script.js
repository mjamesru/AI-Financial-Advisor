class AIFinancialAdvisor {
    constructor() {
        this.initializeEventListeners();
        this.charts = {};
    }

    initializeEventListeners() {
        const form = document.getElementById('financialForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.generateFinancialPlan();
        });
    }

    generateFinancialPlan() {
        const formData = new FormData(document.getElementById('financialForm'));
        const data = {
            salary: parseFloat(formData.get('salary')),
            expenses: parseFloat(formData.get('expenses')),
            goals: formData.get('goals'),
            timeframe: parseInt(formData.get('timeframe')),
            riskTolerance: formData.get('riskTolerance')
        };

        // Calculate financial metrics
        const monthlyDisposable = data.salary - data.expenses;
        const savingsRate = (monthlyDisposable / data.salary) * 100;
        
        // Generate AI-powered financial advice
        const plan = this.generateAIAdvice(data, monthlyDisposable, savingsRate);
        
        // Display results
        this.displayResults(plan, data);
        
        // Generate charts
        this.generateCharts(data, plan);
        
        // Show results section
        document.getElementById('inputSection').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'block';
    }

    generateAIAdvice(data, monthlyDisposable, savingsRate) {
        const plan = {
            summary: '',
            recommendations: [],
            projections: {},
            riskAssessment: '',
            monthlyAllocation: {}
        };

        // AI logic for different scenarios
        if (monthlyDisposable <= 0) {
            plan.summary = `⚠️ <strong>Critical Financial Alert:</strong> Your current expenses ($${data.expenses}) exceed your salary ($${data.salary}). Immediate action is required to avoid debt.`;
            plan.recommendations = [
                'Conduct an emergency expense audit - identify all non-essential spending',
                'Consider additional income sources (side hustle, freelancing, part-time work)',
                'Negotiate with creditors for payment plans if you have existing debt',
                'Look for ways to reduce major expenses (housing, transportation, insurance)',
                'Avoid taking on any new debt until your finances are stable'
            ];
            plan.riskAssessment = 'High Risk: Negative cash flow requires immediate intervention.';
        } else {
            // Positive cash flow scenarios
            const goalStrategies = this.getGoalSpecificStrategy(data.goals, data.timeframe, monthlyDisposable);
            const riskStrategy = this.getRiskBasedStrategy(data.riskTolerance);
            
            plan.summary = `💰 <strong>Great news!</strong> You have $${monthlyDisposable.toLocaleString()} monthly disposable income (${savingsRate.toFixed(1)}% savings rate). ${goalStrategies.summary}`;
            
            // Calculate allocations based on goal and risk tolerance
            plan.monthlyAllocation = this.calculateOptimalAllocation(monthlyDisposable, data.goals, data.riskTolerance);
            
            plan.recommendations = [
                ...goalStrategies.recommendations,
                ...riskStrategy.recommendations,
                ...this.getGeneralFinancialTips(savingsRate)
            ];

            plan.projections = this.calculateProjections(data, monthlyDisposable);
            plan.riskAssessment = riskStrategy.assessment;
        }

        return plan;
    }

    getGoalSpecificStrategy(goal, timeframe, monthlyDisposable) {
        const strategies = {
            emergency_fund: {
                summary: `Your goal is to build an emergency fund. Target: 3-6 months of expenses ($${(3 * parseFloat(document.getElementById('expenses').value)).toLocaleString()} - $${(6 * parseFloat(document.getElementById('expenses').value)).toLocaleString()}).`,
                recommendations: [
                    'Open a high-yield savings account for your emergency fund',
                    'Automate transfers to build the fund consistently',
                    'Keep emergency funds separate from other savings',
                    'Aim for 3-6 months of expenses as your target'
                ]
            },
            retirement: {
                summary: `Planning for retirement requires long-term compound growth. With ${timeframe} months to invest, you can build substantial wealth.`,
                recommendations: [
                    'Maximize employer 401(k) match if available',
                    'Consider opening an IRA (Traditional or Roth)',
                    'Diversify investments across asset classes',
                    'Increase contributions by 1% annually'
                ]
            },
            house_down_payment: {
                summary: `Saving for a house down payment requires disciplined saving and smart investment strategies.`,
                recommendations: [
                    'Target 10-20% down payment for better loan terms',
                    'Use high-yield savings for short-term goals (< 2 years)',
                    'Consider conservative investments for longer timeframes',
                    'Research first-time homebuyer programs'
                ]
            },
            debt_payoff: {
                summary: `Debt elimination will free up future cash flow and reduce financial stress.`,
                recommendations: [
                    'List all debts with interest rates and balances',
                    'Use avalanche method (highest interest first) or snowball method (smallest balance first)',
                    'Consider debt consolidation if it lowers overall interest',
                    'Avoid taking on new debt while paying off existing debt'
                ]
            },
            investment: {
                summary: `Investment growth focuses on building long-term wealth through market appreciation.`,
                recommendations: [
                    'Start with low-cost index funds or ETFs',
                    'Diversify across different asset classes and geographies',
                    'Consider tax-advantaged accounts first',
                    'Rebalance portfolio quarterly'
                ]
            },
            vacation: {
                summary: `Short-term savings goal for travel and experiences.`,
                recommendations: [
                    'Use high-yield savings account for safety',
                    'Set up automatic transfers',
                    'Consider travel rewards credit cards',
                    'Book in advance for better rates'
                ]
            },
            education: {
                summary: `Education funding requires balancing growth potential with timeline needs.`,
                recommendations: [
                    'Consider 529 education savings plans for tax benefits',
                    'Use age-based investment strategies',
                    'Research scholarship and grant opportunities',
                    'Consider in-state tuition options'
                ]
            }
        };

        return strategies[goal] || strategies.investment;
    }

    getRiskBasedStrategy(riskTolerance) {
        const strategies = {
            conservative: {
                recommendations: [
                    'Focus on high-yield savings accounts and CDs',
                    'Consider treasury bonds and stable value funds',
                    'Limit stock exposure to 30-50% of portfolio',
                    'Prioritize capital preservation over growth'
                ],
                assessment: 'Low Risk: Conservative approach focuses on capital preservation with modest growth potential.'
            },
            moderate: {
                recommendations: [
                    'Balance between stocks (60%) and bonds (40%)',
                    'Use diversified index funds and ETFs',
                    'Consider target-date funds for simplicity',
                    'Rebalance annually to maintain allocation'
                ],
                assessment: 'Medium Risk: Balanced approach provides moderate growth potential with managed volatility.'
            },
            aggressive: {
                recommendations: [
                    'Allocate 80-90% to stocks for maximum growth potential',
                    'Consider growth stocks and emerging markets',
                    'Use dollar-cost averaging to reduce timing risk',
                    'Stay invested during market volatility'
                ],
                assessment: 'High Risk: Aggressive approach maximizes growth potential but increases portfolio volatility.'
            }
        };

        return strategies[riskTolerance] || strategies.moderate;
    }

    getGeneralFinancialTips(savingsRate) {
        const tips = [
            'Review and optimize your budget monthly',
            'Set up automatic savings to pay yourself first',
            'Track your net worth quarterly'
        ];

        if (savingsRate < 10) {
            tips.push('Aim to increase your savings rate to at least 10-15%');
        } else if (savingsRate > 20) {
            tips.push('Excellent savings rate! Consider increasing investments for growth');
        }

        return tips;
    }

    calculateOptimalAllocation(monthlyDisposable, goal, riskTolerance) {
        const allocation = {
            emergency: 0,
            goalSavings: 0,
            investments: 0,
            discretionary: 0
        };

        // Base allocation logic
        if (goal === 'emergency_fund') {
            allocation.emergency = monthlyDisposable * 0.7;
            allocation.investments = monthlyDisposable * 0.2;
            allocation.discretionary = monthlyDisposable * 0.1;
        } else if (goal === 'debt_payoff') {
            allocation.goalSavings = monthlyDisposable * 0.7;
            allocation.emergency = monthlyDisposable * 0.2;
            allocation.discretionary = monthlyDisposable * 0.1;
        } else {
            allocation.emergency = monthlyDisposable * 0.2;
            allocation.goalSavings = monthlyDisposable * 0.5;
            allocation.investments = monthlyDisposable * 0.2;
            allocation.discretionary = monthlyDisposable * 0.1;
        }

        return allocation;
    }

    calculateProjections(data, monthlyDisposable) {
        const projections = {};
        const months = data.timeframe;
        
        // Simple projections based on different return scenarios
        const conservativeReturn = 0.03; // 3% annual
        const moderateReturn = 0.07; // 7% annual
        const aggressiveReturn = 0.10; // 10% annual
        
        const monthlyReturn = {
            conservative: conservativeReturn / 12,
            moderate: moderateReturn / 12,
            aggressive: aggressiveReturn / 12
        };

        const returns = monthlyReturn[data.riskTolerance] || monthlyReturn.moderate;
        
        // Calculate future value with compound interest
        projections.totalSavings = monthlyDisposable * months;
        projections.withGrowth = this.futureValueCalculation(monthlyDisposable, returns, months);
        projections.totalGrowth = projections.withGrowth - projections.totalSavings;

        return projections;
    }

    futureValueCalculation(monthlyContribution, monthlyRate, months) {
        if (monthlyRate === 0) return monthlyContribution * months;
        
        return monthlyContribution * (((1 + monthlyRate) ** months - 1) / monthlyRate);
    }

    displayResults(plan, data) {
        const summaryDiv = document.getElementById('planSummary');
        const stepsDiv = document.getElementById('actionableSteps');

        // Display plan summary
        let summaryHTML = `<h3>Financial Analysis</h3><p>${plan.summary}</p>`;
        
        if (data.salary - data.expenses > 0) {
            summaryHTML += `
                <div style="margin-top: 20px;">
                    <div class="metric-card">
                        <h4>Monthly Disposable</h4>
                        <div class="value good">$${(data.salary - data.expenses).toLocaleString()}</div>
                    </div>
                    <div class="metric-card">
                        <h4>Savings Rate</h4>
                        <div class="value ${((data.salary - data.expenses) / data.salary * 100) > 15 ? 'good' : 'warning'}">${(((data.salary - data.expenses) / data.salary) * 100).toFixed(1)}%</div>
                    </div>
                    ${plan.projections.withGrowth ? `
                    <div class="metric-card">
                        <h4>Projected Growth</h4>
                        <div class="value good">$${Math.round(plan.projections.withGrowth).toLocaleString()}</div>
                    </div>` : ''}
                </div>
            `;
        }

        summaryHTML += `<p style="margin-top: 15px;"><strong>Risk Assessment:</strong> ${plan.riskAssessment}</p>`;
        summaryDiv.innerHTML = summaryHTML;

        // Display actionable steps
        const stepsHTML = `
            <h3>AI-Recommended Action Plan</h3>
            <ol>
                ${plan.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ol>
        `;
        stepsDiv.innerHTML = stepsHTML;
    }

    generateCharts(data, plan) {
        this.generateBudgetChart(data, plan);
        this.generateProgressChart(data, plan);
    }

    generateBudgetChart(data, plan) {
        const ctx = document.getElementById('budgetChart').getContext('2d');
        
        if (this.charts.budget) {
            this.charts.budget.destroy();
        }

        const monthlyDisposable = data.salary - data.expenses;
        const allocation = plan.monthlyAllocation;

        if (monthlyDisposable <= 0) {
            // Show expense breakdown for negative cash flow
            this.charts.budget = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Expenses', 'Deficit'],
                    datasets: [{
                        data: [data.expenses, Math.abs(monthlyDisposable)],
                        backgroundColor: ['#e53e3e', '#c53030'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        } else {
            // Show positive allocation
            this.charts.budget = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Expenses', 'Emergency Fund', 'Goal Savings', 'Investments', 'Discretionary'],
                    datasets: [{
                        data: [
                            data.expenses,
                            allocation.emergency || 0,
                            allocation.goalSavings || 0,
                            allocation.investments || 0,
                            allocation.discretionary || 0
                        ],
                        backgroundColor: [
                            '#e53e3e',
                            '#38a169',
                            '#3182ce',
                            '#805ad5',
                            '#d69e2e'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    }

    generateProgressChart(data, plan) {
        const ctx = document.getElementById('progressChart').getContext('2d');
        
        if (this.charts.progress) {
            this.charts.progress.destroy();
        }

        const monthlyDisposable = data.salary - data.expenses;
        
        if (monthlyDisposable <= 0) {
            // Show debt accumulation for negative cash flow
            const months = Array.from({length: Math.min(data.timeframe, 24)}, (_, i) => i + 1);
            const debtAccumulation = months.map(month => Math.abs(monthlyDisposable) * month);

            this.charts.progress = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: months.map(m => `Month ${m}`),
                    datasets: [{
                        label: 'Projected Debt Accumulation',
                        data: debtAccumulation,
                        borderColor: '#e53e3e',
                        backgroundColor: 'rgba(229, 62, 62, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return '$' + value.toLocaleString();
                                }
                            }
                        }
                    }
                }
            });
        } else {
            // Show savings growth projection
            const months = Array.from({length: Math.min(data.timeframe, 60)}, (_, i) => i + 1);
            const savingsWithoutGrowth = months.map(month => monthlyDisposable * month);
            const savingsWithGrowth = months.map(month => {
                if (plan.projections.withGrowth) {
                    const monthlyRate = data.riskTolerance === 'conservative' ? 0.03/12 : 
                                      data.riskTolerance === 'aggressive' ? 0.10/12 : 0.07/12;
                    return this.futureValueCalculation(monthlyDisposable, monthlyRate, month);
                }
                return monthlyDisposable * month;
            });

            this.charts.progress = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: months.map(m => `Month ${m}`),
                    datasets: [{
                        label: 'Savings (No Growth)',
                        data: savingsWithoutGrowth,
                        borderColor: '#3182ce',
                        backgroundColor: 'rgba(49, 130, 206, 0.1)',
                        tension: 0.4
                    }, {
                        label: 'Savings (With Investment Growth)',
                        data: savingsWithGrowth,
                        borderColor: '#38a169',
                        backgroundColor: 'rgba(56, 161, 105, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return '$' + value.toLocaleString();
                                }
                            }
                        }
                    }
                }
            });
        }
    }
}

function resetForm() {
    document.getElementById('financialForm').reset();
    document.getElementById('inputSection').style.display = 'block';
    document.getElementById('resultsSection').style.display = 'none';
}

// Initialize the AI Financial Advisor when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AIFinancialAdvisor();
});