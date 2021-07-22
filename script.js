selectedCells = [];
playerSelections = [];
cpuSelections = [];

function isSelected(cellID)
{
    for (cell of selectedCells)
    {
        if (cell == cellID)
            return false;
    }
    selectedCells.push(cellID);
    return true;
}

function getCPUCell()
{
    let cpuCell = selectedCells[0];
    while (! isSelected(cpuCell))
    {cpuCell = Math.floor(Math.random() * 9);}
    cpuSelections.push(cpuCell);
    return cpuCell;
}

function gameOver(who)
{
    alert(who + " Win")
}

function check(array, who)
{
    test = array.join();
    winCases = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (win of winCases)
    {
        point = 0;
        for (cell of win)
        {
            if (test.search(cell) != -1)
                point++;
        }
        if (point == 3)
            return gameOver(who);
    }
}

function select(playerCell)
{
    if (isSelected(playerCell))
    {
        playerSelections.push(playerCell);
        check(playerSelections, "You");
        document.getElementById(playerCell).style.backgroundImage = "url(x.png)";

        if (selectedCells.length == 9)
            return alert("Draw");

        let cpuCell = getCPUCell();
        document.getElementById(cpuCell).style.backgroundImage = "url(o.png)";
        check(cpuSelections, "CPU");
    }
}