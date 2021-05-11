import React from 'react';
import MenuHeader from './MenuHeader';

const itemsAndUrls = {
    physicalityItems: [
        {
            item: "Team PIM",
            url: "/mostTeamPIM"
        },
        {
            item: "Team Hits",
            url: "/mostTeamHits"
        },
        {
            item: "Player PIM",
            url: "/mostPIM"
        },
        {
            item: "Player Hits",
            url: "/mostHits"
        },
        {
            item: "Fights",
            url: "/fights"
        },
        {
            item: "Majors",
            url: "/majors"
        }
    ],
    skatersItems: [
        {
            item: "Goals",
            url: "/mostGoals"
        },
        {
            item: "Assists",
            url: "/mostAssists"
        },
        {
            item: "Points",
            url: "/mostPoints"
        },
        {
            item: "PP Goals",
            url: "/mostPPGoals"
        },
        {
            item: "SH Goals",
            url: "/mostSHGoals"
        },
        {
            item: "Plus/Minus",
            url: "/bestPlusMinus"
        }
    ],
    goaliesItems: [
        {
            item: "Save %",
            url: "/savePercentage"
        },
        {
            item: "GAA",
            url: "/goalsAgainstAverage"
        },
        {
            item: "Shutouts",
            url: "/shutOuts"
        },
        {
            item: "Shot Types",
            url: "/shotTypes"
        }
    ]
}

class Menu extends React.Component {
    render() {
        return (
            <div className="menu">
                <ul className="menuHeaders">
                    <MenuHeader title="Physicality" dropDownItems={itemsAndUrls.physicalityItems} />
                    <MenuHeader title="Skaters" dropDownItems={itemsAndUrls.skatersItems} />
                    <MenuHeader title="Goalies" dropDownItems={itemsAndUrls.goaliesItems} />
                </ul>
            </div>
        )
    }
}

export default Menu;