import { useState } from 'react';

export default function ROIGuide() {
  const [inputs, setInputs] = useState({
    currentStaffCost: 5000,
    staffHoursPerWeek: 40,
    messagesPerDay: 100,
    avgResponseTime: 15,
    customerSatisfaction: 75
  });

  // Calculate ROI
  const aiConciergeMonthlyFee = 299; // Professional plan
  const timeSavingsPercent = 70;
  const satisfactionIncrease = 25;
  const responseTimeReduction = 90;

  const monthlyStaffCost = inputs.currentStaffCost;
  const monthlySavings = (monthlyStaffCost * timeSavingsPercent) / 100;
  const netSavings = monthlySavings - aiConciergeMonthlyFee;
  const roi = ((netSavings / aiConciergeMonthlyFee) * 100).toFixed(1);
  const paybackPeriod = (aiConciergeMonthlyFee / monthlySavings).toFixed(1);

  const newResponseTime = inputs.avgResponseTime * (1 - responseTimeReduction / 100);
  const newSatisfaction = Math.min(100, inputs.customerSatisfaction + satisfactionIncrease);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      color: '#FFFFFF',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '80px 20px 40px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 56px)',
            background: 'linear-gradient(135deg, #D4AF37 0%, #F4E5B8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '20px'
          }}>
            📊 ROI Calculator
          </h1>
          <p style={{
            fontSize: 'clamp(18px, 3vw, 24px)',
            color: '#888888',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            See how AI LUXE Concierge can transform your business economics
          </p>
        </div>

        {/* Key Benefits */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '60px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
            padding: '30px',
            borderRadius: '20px',
            border: '2px solid #D4AF37',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>⏱️</div>
            <div style={{ fontSize: '32px', color: '#D4AF37', fontWeight: '700', marginBottom: '5px' }}>
              {timeSavingsPercent}%
            </div>
            <div style={{ color: '#888888' }}>Time Savings</div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
            padding: '30px',
            borderRadius: '20px',
            border: '2px solid #25D366',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>😊</div>
            <div style={{ fontSize: '32px', color: '#25D366', fontWeight: '700', marginBottom: '5px' }}>
              +{satisfactionIncrease}%
            </div>
            <div style={{ color: '#888888' }}>Satisfaction Boost</div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
            padding: '30px',
            borderRadius: '20px',
            border: '2px solid #0088cc',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>⚡</div>
            <div style={{ fontSize: '32px', color: '#0088cc', fontWeight: '700', marginBottom: '5px' }}>
              {responseTimeReduction}%
            </div>
            <div style={{ color: '#888888' }}>Faster Responses</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '40px' }}>
          {/* Input Section */}
          <div>
            <h2 style={{
              fontSize: '28px',
              color: '#D4AF37',
              marginBottom: '30px'
            }}>
              Your Current Situation
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '10px', color: '#888888' }}>
                  Monthly Staff Cost (USD)
                </label>
                <input
                  type="number"
                  value={inputs.currentStaffCost}
                  onChange={(e) => setInputs({ ...inputs, currentStaffCost: Number(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '15px',
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '18px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '10px', color: '#888888' }}>
                  Staff Hours Per Week
                </label>
                <input
                  type="number"
                  value={inputs.staffHoursPerWeek}
                  onChange={(e) => setInputs({ ...inputs, staffHoursPerWeek: Number(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '15px',
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '18px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '10px', color: '#888888' }}>
                  Messages Per Day
                </label>
                <input
                  type="number"
                  value={inputs.messagesPerDay}
                  onChange={(e) => setInputs({ ...inputs, messagesPerDay: Number(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '15px',
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '18px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '10px', color: '#888888' }}>
                  Avg Response Time (minutes)
                </label>
                <input
                  type="number"
                  value={inputs.avgResponseTime}
                  onChange={(e) => setInputs({ ...inputs, avgResponseTime: Number(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '15px',
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '18px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '10px', color: '#888888' }}>
                  Customer Satisfaction (%)
                </label>
                <input
                  type="number"
                  value={inputs.customerSatisfaction}
                  onChange={(e) => setInputs({ ...inputs, customerSatisfaction: Number(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '15px',
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '18px'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div>
            <h2 style={{
              fontSize: '28px',
              color: '#D4AF37',
              marginBottom: '30px'
            }}>
              With AI LUXE Concierge
            </h2>

            <div style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
              padding: '40px',
              borderRadius: '20px',
              border: '2px solid #D4AF37',
              marginBottom: '30px'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{ color: '#888888', marginBottom: '10px' }}>Monthly ROI</div>
                <div style={{
                  fontSize: '64px',
                  color: '#D4AF37',
                  fontWeight: '700'
                }}>
                  {roi}%
                </div>
              </div>

              <div style={{ borderTop: '1px solid #333', paddingTop: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#888888' }}>Monthly Savings</span>
                  <span style={{ color: '#25D366', fontSize: '20px', fontWeight: '600' }}>
                    ${monthlySavings.toFixed(0)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#888888' }}>AI LUXE Cost</span>
                  <span style={{ color: '#FFFFFF', fontSize: '20px' }}>
                    ${aiConciergeMonthlyFee}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '20px', borderTop: '1px solid #333' }}>
                  <span style={{ color: '#D4AF37', fontWeight: '600' }}>Net Monthly Savings</span>
                  <span style={{ color: '#D4AF37', fontSize: '24px', fontWeight: '700' }}>
                    ${netSavings.toFixed(0)}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                background: '#1a1a1a',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #333'
              }}>
                <div style={{ color: '#888888', marginBottom: '5px' }}>Payback Period</div>
                <div style={{ fontSize: '24px', color: '#D4AF37', fontWeight: '600' }}>
                  {paybackPeriod} months
                </div>
              </div>

              <div style={{
                background: '#1a1a1a',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #333'
              }}>
                <div style={{ color: '#888888', marginBottom: '5px' }}>New Response Time</div>
                <div style={{ fontSize: '24px', color: '#0088cc', fontWeight: '600' }}>
                  {newResponseTime.toFixed(1)} minutes
                </div>
              </div>

              <div style={{
                background: '#1a1a1a',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #333'
              }}>
                <div style={{ color: '#888888', marginBottom: '5px' }}>New Satisfaction Rate</div>
                <div style={{ fontSize: '24px', color: '#25D366', fontWeight: '600' }}>
                  {newSatisfaction.toFixed(0)}%
                </div>
              </div>
            </div>

            <button style={{
              width: '100%',
              marginTop: '30px',
              padding: '18px',
              background: 'linear-gradient(135deg, #D4AF37 0%, #F4E5B8 100%)',
              color: '#000000',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '700',
              cursor: 'pointer'
            }}>
              Get Started Now →
            </button>
          </div>
        </div>

        {/* Annual Projection */}
        <div style={{
          marginTop: '60px',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
          padding: '40px',
          borderRadius: '20px',
          border: '2px solid #D4AF37'
        }}>
          <h3 style={{ fontSize: '28px', color: '#D4AF37', marginBottom: '30px', textAlign: 'center' }}>
            12-Month Projection
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '30px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#888888', marginBottom: '10px' }}>Total Savings</div>
              <div style={{ fontSize: '36px', color: '#25D366', fontWeight: '700' }}>
                ${(netSavings * 12).toFixed(0)}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#888888', marginBottom: '10px' }}>Time Saved</div>
              <div style={{ fontSize: '36px', color: '#0088cc', fontWeight: '700' }}>
                {((inputs.staffHoursPerWeek * 52 * timeSavingsPercent) / 100).toFixed(0)} hrs
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#888888', marginBottom: '10px' }}>Messages Handled</div>
              <div style={{ fontSize: '36px', color: '#D4AF37', fontWeight: '700' }}>
                {(inputs.messagesPerDay * 365).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
