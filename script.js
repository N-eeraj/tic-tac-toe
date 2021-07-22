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

function clear()
{
    selectedCells = [];
    playerSelections = [];
    cpuSelections = [];

    for (cell of document.getElementsByClassName("cell"))
        cell.style.backgroundImage = "None";
}

function gameOver(who)
{
    if (who == "none")
        document.getElementById("winner").innerText = "Draw Match";
    else
        document.getElementById("winner").innerText = who + " Won";
    document.getElementById("overlay").style.display = "block";
    document.getElementById("modal").style.transform = "scale(1)";
    clear();
    return true;
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
        document.getElementById(playerCell).style.backgroundImage = "url(x.png)";
        if (check(playerSelections, "You"))
            return;

        if (selectedCells.length == 9)
            return gameOver("none");

        let cpuCell = getCPUCell();
        document.getElementById(cpuCell).style.backgroundImage = "url(o.png)";
        check(cpuSelections, "CPU");
    }
}

function playAgain()
{
    document.getElementById("overlay").style.display = "none";
    document.getElementById("modal").style.transform = "scale(0)";
}

clear()