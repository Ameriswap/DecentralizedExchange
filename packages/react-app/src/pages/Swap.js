import React, { useState, useEffect }  from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import UIToken from './UIToken';

export default function Swap() {
  return (
    <div>
      <div class="header-content2 row">
        <div class="col-md-2"></div>
        <div class="content2 col-md-5">
          <div class="swap-box1">
            <h1>Quick Swap</h1>
            <div class="row first-row">
              <div class="col-md-5">
                <div class="row">
                  <div class="col-md-2">
                    <label class="from">From</label>
                  </div>
                  <div class="col-md-2">
                  </div>
                  <div class="col-md-2">
                    <label class="balance">Balance:</label>
                  </div>
                  <div class="col-md-2">
                  </div>
                  <div class="col-md-2">
                    <label class="remaining">3122.9</label>
                  </div>
                </div>
                <input type="text" class="form-control" />
              </div>
              <div class="col-md-2">
                <img class="swap" src="image/icons/swap.svg"/>
              </div>
              <div class="col-md-5">
                <div class="row">
                  <div class="col-md-2">
                    <label class="from">To</label>
                  </div>
                  <div class="col-md-2">
                  </div>
                  <div class="col-md-2">
                    <label class="balance">Balance:</label>
                  </div>
                  <div class="col-md-2">
                  </div>
                  <div class="col-md-2">
                    <label class="remaining">3122.9</label>
                  </div>
                </div>
                <input type="text" class="form-control" />
              </div>
            </div>
            <div class="row">
              <div class="col-md-4">
              </div>
              <div class="col-md-4">
                <button class="btn-wallet">
                    Swap
                </button>
              </div>
              <div class="col-md-4">
              </div>
            </div>
          </div>
        </div>
        <div class="content2-2nd col-md-5">
          <div class="swap-box2">
          </div>
        </div>
      </div>      
    </div>
  );
}
