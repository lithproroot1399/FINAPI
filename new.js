const { request, response } = require("express");
const express = require("express");
const {v4: uuid4 } = require("uuid");

const app = express();

app.use(express.json());

const customers = [];

function verifyIfExistsAccountCPF(reques, response)