import plotly.graph_objects as go
import json

# Load the data
data_json = {"comparison_data": [{"metric": "Force Applied (N)", "traditional": 700, "hydraulic_amplified": 8400, "improvement_factor": 12}, {"metric": "Typical Voltage Output (V)", "traditional": 5, "hydraulic_amplified": 50, "improvement_factor": 10}, {"metric": "Power Output (mW)", "traditional": 2, "hydraulic_amplified": 25, "improvement_factor": 12.5}, {"metric": "System Efficiency (%)", "traditional": 15, "hydraulic_amplified": 35, "improvement_factor": 2.3}, {"metric": "Operational Frequency (Hz)", "traditional": 50, "hydraulic_amplified": 0.5, "improvement_factor": 0.01}, {"metric": "Mechanical Complexity (Scale 1-10)", "traditional": 3, "hydraulic_amplified": 7, "improvement_factor": 2.3}, {"metric": "Initial Cost ($)", "traditional": 50, "hydraulic_amplified": 150, "improvement_factor": 3}, {"metric": "Durability (Years)", "traditional": 5, "hydraulic_amplified": 10, "improvement_factor": 2}]}

# Process data for percentage change comparison
metrics = []
percent_changes = []
colors = []

for item in data_json["comparison_data"]:
    # Use clearer metric names with units
    metric = item["metric"]
    if "Force Applied" in metric:
        metric = "Force (N)"
    elif "Typical Voltage Output" in metric:
        metric = "Voltage (V)"
    elif "Power Output" in metric:
        metric = "Power (mW)"
    elif "System Efficiency" in metric:
        metric = "Efficiency (%)"
    elif "Operational Frequency" in metric:
        metric = "Frequency (Hz)"
    elif "Mechanical Complexity" in metric:
        metric = "Complexity"
    elif "Initial Cost" in metric:
        metric = "Cost ($)"
    elif "Durability" in metric:
        metric = "Durability (Y)"
    
    metrics.append(metric)
    
    # Calculate percentage change from traditional to hydraulic
    traditional = item["traditional"]
    hydraulic = item["hydraulic_amplified"]
    percent_change = ((hydraulic - traditional) / traditional) * 100
    
    # For metrics where increase is bad (complexity, cost), show as negative improvement
    if metric in ["Complexity", "Cost ($)"]:
        percent_changes.append(-abs(percent_change))  # Show as negative
        colors.append('#DB4545')  # Red for negative aspects
    elif percent_change < 0:
        percent_changes.append(percent_change)
        colors.append('#DB4545')  # Red for decreases
    else:
        percent_changes.append(percent_change)
        colors.append('#2E8B57')  # Green for improvements

# Create the figure
fig = go.Figure()

# Add percentage change bars
fig.add_trace(go.Bar(
    x=metrics,
    y=percent_changes,
    marker_color=colors,
    hovertemplate='<b>%{x}</b><br>Change: %{y:.0f}%<br><extra></extra>',
    showlegend=False
))

# Add a horizontal line at y=0 to show baseline (no change)
fig.add_hline(y=0, line_dash="solid", line_color="black", line_width=1)

# Update layout
fig.update_layout(
    title='Hydraulic vs Traditional: % Change',
    xaxis_title='Metrics',
    yaxis_title='Percent Change (%)',
    annotations=[
        dict(
            x=1, y=0, xref='paper', yref='y',
            text='No Change', showarrow=False,
            xanchor='right', yanchor='bottom'
        )
    ]
)

# Update traces
fig.update_traces(cliponaxis=False)

# Update axes for better readability
fig.update_xaxes(tickangle=45)
fig.update_yaxes(zeroline=True, zerolinewidth=2, zerolinecolor="black")

# Add text note about interpretation
fig.add_annotation(
    text="Green: Better performance | Red: Worse/Higher cost",
    xref="paper", yref="paper", x=0.5, y=-0.15,
    xanchor='center', yanchor='top', showarrow=False,
    font=dict(size=10)
)

# Save the chart
fig.write_image("piezoelectric_percentage_comparison.png")