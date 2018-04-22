function cholesky() {
  hideSteps();
  let origin = getTableValues();

  origin = [
    [16, -4, 12, -4],
    [-4, 2, -1, 1],
    [12, -1, 14, -2],
    [-4, 1, -2, 83]
  ];

  if (origin == null) {
    alert("Preencha todos os campos!");
    return;
  } else if (isNullMatrix(origin)) {
    alert("A matriz não pode ser nula!");
    return;
  } else if (math.det(origin) == 0) {
    alert("É uma matriz singular. O determinante da matriz é 0");
    return;
  } else if (!sylvester(origin)) {
    alert("A matriz não atende ao Critério de Sylvester");
    return;
  }
  //console.log(isSymmetric(origin))

  let matrixG = getLUMatrix(origin, "g", (label = "g"));
  let matrixGWValues = copyMatrix(matrixG);
  let matrixGT = math.transpose(matrixG);

  addStep(
    (title = "Matrizes iniciais"),
    (matrix =
      maTex(origin, "A =") + maTex(matrixG, "G =") + maTex(matrixGT, "G^T ="))
  );

  addStep(
    (title = "Equação para encontrar o Fator de Cholesky"),
    (matrix = maTex(origin) + maTex(matrixG, "=") + maTex(matrixGT)),
    (equations = [katex.renderToString("A = GG^T")])
  );

  let equation = "";
  let equationWValues = "";
  let equationResult = 0;
  let finalEquations = [];
  let factorEquation = "";
  let factorEquationWValues = "";
  let factorFinal = 0;

  for (let j = 0; j < origin.length; j++) {
    finalEquations = [
      maTex(getColumn(origin, j), "") + maTex(getColumn(matrixGT, j), "= G")
    ];

    for (let i = j; i < origin.length; i++) {
      equation = "";
      equationWValues = "";
      equationResult = 0;

      if (i == j) {
        factorEquation = "- (";
        factorEquationWValues = "- (";
        factorFinal = 0;

        for (let n = 0; n < j; n++) {
          factorFinal += matrixGWValues[j][n] ** 2;

          factorEquation += underIndex("g", j + 1 + "" + (n + 1)) + "^2 + ";
          factorEquationWValues += negative(matrixGWValues[j][n]) + "^2 + ";
        }

        matrixGWValues[i][j] =
          Math.round(Math.sqrt(origin[i][j] - factorFinal) * 1000) / 1000;

        if (factorEquation !== "- (") {
          factorEquation = factorEquation.slice(0, -3) + ")";
          factorEquationWValues = factorEquationWValues.slice(0, -3) + ")";
        } else {
          factorEquation = factorEquationWValues = "";
        }

        equation =
          underIndex("g", i + 1 + "" + (j + 1)) +
          " = \\sqrt{" +
          underIndex("a", i + 1 + "" + (j + 1)) +
          factorEquation +
          "}";

        equationWValues =
          underIndex("g", i + 1 + "" + (j + 1)) +
          " = \\sqrt{" +
          origin[i][j] +
          factorEquationWValues +
          "}";

        equationResult =
          underIndex("g", i + 1 + "" + (j + 1)) + " = " + matrixGWValues[i][j];

        /*console.log(equation);
        console.log(equationWValues);
        console.log(equationResult);
        console.log('');*/
      } else {
        factorEquation = "";
        factorEquationWValues = "";
        factorFinal = 0;

        for (let n = 0; n < j; n++) {
          factorFinal -= matrixGWValues[i][n] * matrixGWValues[j][n];

          factorEquation +=
            "-" +
            underIndex("g", i + 1 + "" + (n + 1)) +
            " * " +
            underIndex("g", j + 1 + "" + (n + 1));
          factorEquationWValues +=
            "-" +
            negative(matrixGWValues[i][n]) +
            "*" +
            negative(matrixGWValues[j][n]);
        }

        matrixGWValues[i][j] =
          Math.round(
            (origin[j][i] + factorFinal) / matrixGWValues[j][j] * 1000
          ) / 1000;

        equation =
          underIndex("g", i + 1 + "" + (j + 1)) +
          " = \\frac{" +
          underIndex("a", i + 1 + "" + (j + 1)) +
          factorEquation +
          "}{" +
          underIndex("g", j + 1 + "" + (j + 1)) +
          "}";

        equationWValues =
          underIndex("g", i + 1 + "" + (j + 1)) +
          " = \\frac{" +
          origin[i][j] +
          factorEquationWValues +
          "}{" +
          matrixGWValues[j][j] +
          "}";

        equationResult =
          underIndex("g", i + 1 + "" + (j + 1)) + " = " + matrixGWValues[i][j];

        /*console.log(equation);
        console.log(equationWValues);
        console.log(equationResult);
        console.log('');*/
      }

      finalEquations.push(
        katex.renderToString(
          "\\begin{matrix} " +
            equation +
            " \\\\ " +
            equationWValues +
            " \\\\ " +
            equationResult +
            "\\end{matrix}"
        )
      );

      //console.log(finalEquations.length);
    }

    addStep(
      (title = "Coluna " + (j + 1)),
      (matrix = maTex(matrixGWValues, "G =")),
      (equations = finalEquations)
    );
  }

  addStep(
    (title = "Fator de Cholesky"),
    (matrix = maTex(matrixGWValues, "G ="))
  );
}

function showOperationButton() {
  /*
    Mostra o botão de ação para utilizar o método de eliminação de Gauss
  */

  var btn = document.getElementById("btn");
  btn.innerHTML =
    '<a class="waves-effect waves-light btn-large" onclick="cholesky()">Fator de Cholesky</a>';
}

function hideOperationButton() {
  document.getElementById("btn").innerHTML = "";
}
