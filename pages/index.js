import Head from "next/head";
import React, { useState } from "react";

export default function Home() {
  const [method, setMethod] = useState("");
  const [route, setRoute] = useState("");
  const [output, setOutput] = useState("");
  const [responses, setResponses] = useState([]);

  const generateApiDocumentation = ({ target }) => {
    if (getMethod(target.value).method) {
      setMethod(getMethod(target.value).method.toUpperCase());
    }

    setRoute(getRoute(target.value).route);
  };

  const getMethod = (str) => {
    var regex = /\Route\.((get|delete|post|put|resource))/gim;
    var m;
    var matches = [];
    while ((m = regex.exec(str)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      // The result can be accessed through the `m`-variable.
      m.forEach((match, groupIndex) => {
        if (groupIndex > 0) {
          matches = [...matches, match];
        }
      });
    }
    return { method: matches[0] };
  };

  const getRoute = (str) => {
    var regex = /(\"|\').*?(\"|\')/gim;
    var m;
    var matches = [];
    while ((m = regex.exec(str)) !== null) {
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      m.forEach((match, groupIndex) => {
        matches = [...matches, match];
      });
    }

    matches = matches.map((el) => {
      return el.replace(/\"|\'/gim, "").trim();
    });
    console.log(matches);
    return { route: matches[0] };
  };

  const onSubmitGerarDocumentacaoApi = (ev) => {
    ev.preventDefault();
    const {
      method,
      route,
      description,
      params,
      jwt_required,
      status_success,
      example,
    } = ev.target.elements;

    let jwt = jwt_required.checked ? "\n\n**JWT é obrigatório**" : "";

    let dot = "```";

    var titles = [...document.getElementsByName("title[]")];
    var resposta = [...document.getElementsByName("resposta[]")];

    titles = titles.map((el, index) => {
      return `- **${el.value}**\n\n${dot}\n${resposta[index].value}\n${dot}`;
    });

    setOutput(
      `---\n > \`${method.value}\` **${route.value}** ${jwt}\n\n ## ${
        description.value
      }\n\n> ## Examples \n ${dot}\n${example.value}\n${dot}
      \n\n> ## Params\n${
        params.value
      }\n\n> ## Responses\n\n- **Em caso de sucesso**\n\n${dot}\n${
        status_success.value
      }\n${dot}\n\n${titles.join("\n")}
      `
    );
  };

  const onCopyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  const handleAddNewResponse = () => {
    let response = {
      key: responses.length + 1,
    };

    setResponses([...responses, response]);
  };

  return (
    <div>
      <Head>
        <title>Create Documentation API</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <form action="" onSubmit={onSubmitGerarDocumentacaoApi}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            height: "100vh",
            overflow: "auto",
          }}
        >
          <div style={{ flex: 1, margin: 20 }}>
            <div className="control">
              <label htmlFor="">Cole aqui o código da rota</label>
              <textarea
                rows="2"
                cols="50"
                id="textarea"
                onInput={generateApiDocumentation}
              ></textarea>
            </div>
            <div className="control">
              <label htmlFor="">Método Requisição: </label>
              <input value={method} name="method" />
            </div>
            <div className="control">
              <label htmlFor="">Nome da Rota: </label>
              <input
                value={route}
                name="route"
                onChange={({ target }) => {
                  setRoute(target.value);
                }}
              />
            </div>
            <div className="control">
              <label htmlFor="jwt_required">JWT obrigatório?</label>
              <input type="checkbox" name="jwt_required" id="jwt_required" />
            </div>
            <div className="control">
              <label htmlFor="">Descrição</label>
              <br />
              <textarea name="description" id="" rows="3"></textarea>
            </div>{" "}
            <div className="control">
              <label htmlFor="">Exemplo</label>
              <br />
              <textarea name="example" id="" rows="5"></textarea>
            </div>
          </div>
          <div style={{ flex: 1, margin: 20 }}>
            <div className="control">
              <label htmlFor="">Parâmetros</label>
              <br />
              <textarea name="params" id="" rows="5"></textarea>
            </div>{" "}
            <div className="control">
              <h3>Respostas</h3>
              <div className="control">
                <label htmlFor="">Em caso de sucesso</label>
                <textarea name="status_success" id="" rows="5"></textarea>
              </div>
              <button type="button" onClick={handleAddNewResponse}>
                add+
              </button>
              {(responses || []).map((el) => {
                return (
                  <div className="control" key={el.key}>
                    <label htmlFor={`titulo_${el.key}`}>Título</label>
                    <input
                      type="text"
                      name={`title[]`}
                      id={`titulo_${el.key}`}
                      className="control-resposta-title"
                      placeholder={"Título"}
                    />
                    <textarea
                      placeholder="Resposta"
                      name="resposta[]"
                    ></textarea>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ flex: 1, margin: 20 }}>
            <label htmlFor="">Saída:</label>
            <pre>{output}</pre>
            <button type="submit">Gerar</button> &nbsp;
            <button onClick={onCopyToClipboard}>Copiar</button>
          </div>
          <style>
            {`
            .control{
              margin-bottom:30px;
            }
            textarea{
              width:100%;
            }
            .control-resposta-title{
              width:100%;
            }
          `}
          </style>
        </div>
      </form>
    </div>
  );
}
